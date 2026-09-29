import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { explicacao } = await request.json();

    if (!explicacao) {
      return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback para ambiente de desenvolvimento sem chave da OpenAI
      console.warn("OpenAI API Key não configurada. Usando áudio de teste.");
      return NextResponse.json({ 
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
      });
    }

    // Criar um hash do texto para usar como nome do arquivo e fazer cache
    const hash = crypto.createHash('md5').update(explicacao).digest('hex');
    const fileName = `${hash}.mp3`;

    // Verificar se o áudio já existe no Supabase Storage
    const { data: existingFile } = await supabase.storage
      .from('tts-audio')
      .getPublicUrl(fileName);

    // O Supabase retorna a URL mesmo se o arquivo não existir, mas se ele não existir, a URL vai dar 404 ao tentar baixar.
    // Para simplificar, neste mock assumiremos que sempre gera novo se não tratarmos 404, mas num código real faríamos um `list` ou tratariamos o erro de GET.
    // Vamos gerar sempre no nosso caso se quisermos garantir, mas a lógica de cache ideal seria:
    const { data: fileList } = await supabase.storage.from('tts-audio').list('', { search: fileName });
    
    if (fileList && fileList.length > 0) {
      return NextResponse.json({ url: existingFile.publicUrl });
    }

    // Se não existir, gera via OpenAI
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: explicacao,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Fazer upload para o Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('tts-audio')
      .upload(fileName, buffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Erro ao fazer upload para o Supabase:', uploadError);
      return NextResponse.json({ error: 'Erro ao salvar áudio' }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('tts-audio')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Erro no TTS:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { id, email, nomeCompleto, ondeEstuda, cidade, endereco, telefone } = data;

    if (!id || !email) {
      return NextResponse.json({ error: 'ID e Email são obrigatórios' }, { status: 400 });
    }

    // Localiza se já existe por ID ou email para evitar quebra de constraint única
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id },
          { email }
        ]
      }
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          nomeCompleto: nomeCompleto ?? existingUser.nomeCompleto,
          ondeEstuda: ondeEstuda ?? existingUser.ondeEstuda,
          cidade: cidade ?? existingUser.cidade,
          endereco: endereco ?? existingUser.endereco,
          telefone: telefone ?? existingUser.telefone,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          id,
          email,
          nomeCompleto,
          ondeEstuda,
          cidade,
          endereco,
          telefone,
        },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Erro ao registrar usuário no banco:', error);
    return NextResponse.json({ 
      error: 'Erro interno ao salvar usuário', 
      details: error?.message || String(error) 
    }, { status: 500 });
  }
}

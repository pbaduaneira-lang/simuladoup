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

    // Upsert the user in the database (creating if not exists)
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        nomeCompleto,
        ondeEstuda,
        cidade,
        endereco,
        telefone,
      },
      create: {
        id,
        email,
        nomeCompleto,
        ondeEstuda,
        cidade,
        endereco,
        telefone,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Erro ao registrar usuário no banco:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar usuário' }, { status: 500 });
  }
}

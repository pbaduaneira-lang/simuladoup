import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// No futuro pegaremos o userId da sessão. Por enquanto usamos o ID que vem no corpo para manter o mock
export async function PATCH(request: Request) {
  try {
    const data = await request.json()
    const { userId, ...updateData } = data

    if (!userId) {
      return NextResponse.json({ error: 'Falta o userId' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    return NextResponse.json({ success: true, user })

  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

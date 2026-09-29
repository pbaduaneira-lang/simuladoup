import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, questionId, selectedOption, tempo } = body

    if (!userId || !questionId) {
      return NextResponse.json({ error: 'Faltam dados: userId ou questionId' }, { status: 400 })
    }

    // 1. Buscar a questão no banco de dados para obter o gabarito oficial
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      return NextResponse.json({ error: 'Questão não encontrada' }, { status: 404 })
    }

    // 2. Validação SERVER-SIDE: O servidor decide se o usuário acertou
    const acertou = typeof selectedOption === 'number' 
      ? selectedOption === question.correta 
      : Boolean(body.acertou) // Retrocompatibilidade temporária

    // 3. Salvar a resposta do usuário
    const userAnswer = await prisma.userAnswer.create({
      data: {
        userId,
        questionId,
        acertou,
        tempo: typeof tempo === 'number' ? tempo : 0,
      }
    })

    let xpGained = 0
    let currentStreak = 0
    let totalXp = 0

    // 4. Se acertou, atualizar XP e Streak do usuário
    if (acertou) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (user) {
        currentStreak = user.streak + 1
        xpGained = 10 + (currentStreak * 2)
        totalXp = user.xp + xpGained

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: totalXp,
            streak: currentStreak
          }
        })
      }
    } else {
      // Se errou, o streak zera, mas o XP permanece
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (user) {
        totalXp = user.xp
        currentStreak = 0
        await prisma.user.update({
          where: { id: userId },
          data: {
            streak: 0
          }
        })
      }
    }

    // 5. Retorna o veredito oficial, o gabarito e a explicação SOMENTE agora
    return NextResponse.json({ 
      success: true, 
      acertou,
      correta: question.correta,
      explicacaoIA: question.explicacaoIA,
      userAnswer,
      xpGained,
      totalXp,
      currentStreak
    })

  } catch (error: any) {
    console.error('Erro ao processar progresso:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

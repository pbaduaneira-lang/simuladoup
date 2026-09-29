import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // Se não passar userId, usa um de teste mockado
    const userId = body.userId || "b6b43411-fe62-4966-ac48-1cfd906d2e85";

    // Busca todas as questões (num app real usaríamos raw query ORDER BY RANDOM())
    const allQuestions = await prisma.question.findMany();
    
    // Embaralha e pega 10 questões aleatórias
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 10);

    // Cria o registro no banco
    const simulado = await prisma.simulado.create({
      data: {
        userId,
        type: "PERSONAL",
        questions: JSON.stringify(selectedQuestions),
      }
    });

    return NextResponse.json({ id: simulado.id, success: true });

  } catch (error) {
    console.error("Erro ao gerar simulado pessoal:", error);
    return NextResponse.json({ error: "Falha ao gerar simulado" }, { status: 500 });
  }
}

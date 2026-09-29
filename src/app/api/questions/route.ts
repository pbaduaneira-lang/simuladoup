import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const simulado = searchParams.get("simulado");
  const materia = searchParams.get("materia");

  try {
    let questoes = [];

    if (simulado && simulado !== "geral-do-dia") {
      const simuladoRecord = await prisma.simulado.findUnique({
        where: { id: simulado }
      });

      if (simuladoRecord && simuladoRecord.questions) {
        try {
          const parsed = typeof simuladoRecord.questions === 'string' 
            ? JSON.parse(simuladoRecord.questions) 
            : simuladoRecord.questions;
          if (Array.isArray(parsed) && parsed.length > 0) {
            questoes = parsed;
          }
        } catch (e) {
          console.error("Erro ao converter questões do simulado:", e);
        }
      }
    } 
    
    if (questoes.length === 0) {
      let allQuestions = await prisma.question.findMany();
      
      if (materia) {
        const normalizeString = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        allQuestions = allQuestions.filter(q => normalizeString(q.materia) === normalizeString(materia));
      }
      
      // Embaralha as questões para o feed e limita a 10
      questoes = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    // O Frontend NÃO recebe 'correta' nem 'explicacaoIA' para garantir integridade e segurança (Server-Side Validation)
    const formattedQuestoes = questoes.map(q => ({
      id: q.id,
      materia: q.materia,
      dificuldade: q.dificuldade,
      enunciado: q.enunciado,
      alternativas: typeof q.alternativas === 'string' ? JSON.parse(q.alternativas) : q.alternativas
    }));

    return NextResponse.json({ success: true, questoes: formattedQuestoes });
  } catch (error: any) {
    console.error("Erro ao buscar questões:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

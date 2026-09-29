import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';
const openai = new OpenAI(); // Usa process.env.OPENAI_API_KEY automaticamente

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || "b6b43411-fe62-4966-ac48-1cfd906d2e85";

    const date = new Date();
    const weekNumber = Math.ceil(Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000)) / 7);
    const semana = `${date.getFullYear()}-W${weekNumber}`;

    // Buscar os últimos 20 erros do usuário
    const ultimosErros = await prisma.userAnswer.findMany({
      where: { userId, acertou: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { question: true }
    });

    let context = "";
    if (ultimosErros.length === 0) {
      context = "O usuário ainda não cometeu erros recentes. Crie uma trilha genérica com as matérias principais: Matemática, Português, História e Ciências.";
    } else {
      const materiasCount: Record<string, number> = {};
      ultimosErros.forEach(e => {
        if (e.question) {
          const mat = e.question.materia;
          materiasCount[mat] = (materiasCount[mat] || 0) + 1;
        }
      });
      const matStr = Object.entries(materiasCount).map(([k, v]) => `${k} (${v} erros)`).join(', ');
      context = `O usuário está com dificuldades nas seguintes matérias: ${matStr}.`;
    }

    const prompt = `Você é um assistente educacional que gera uma trilha de estudos semanal gamificada.
Contexto do Aluno: ${context}
Gere exatamente 4 tópicos de estudo curtos e envolventes para essa semana.
O retorno deve ser ESTRITAMENTE em formato JSON. O JSON deve conter uma chave "trilha" cujo valor é um array de objetos.
Cada objeto deve ter as chaves:
- text (string): Título do passo (ex: "Matemática: Dominando Geometria")
- status (string): sempre "locked", exceto o primeiro que deve ser "current"

Exemplo de retorno esperado:
{
  "trilha": [
    { "text": "Revisão: Revolução Industrial", "status": "current" },
    { "text": "Exercícios de Trigonometria", "status": "locked" },
    { "text": "Português: Crase Nível Hard", "status": "locked" },
    { "text": "Simulado Geral da Semana", "status": "locked" }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const respostaTexto = completion.choices[0].message.content || '{"trilha":[]}';
    let trilhaArray = [];
    try {
      const parsed = JSON.parse(respostaTexto);
      trilhaArray = parsed.trilha || [];
      if (!Array.isArray(trilhaArray) || trilhaArray.length === 0) {
          throw new Error("Invalid format");
      }
    } catch {
       trilhaArray = [
          { text: "Matemática: Revisão Básica", status: "current" },
          { text: "História: Idade Média", status: "locked" },
          { text: "Português: Regência", status: "locked" },
          { text: "Simulado Geral", status: "locked" },
       ];
    }

    // Salvar no banco
    const trilhaSalva = await prisma.trilhaDaSemana.upsert({
      where: { userId_semana: { userId, semana } },
      update: { trilha: JSON.stringify(trilhaArray) },
      create: { userId, semana, trilha: JSON.stringify(trilhaArray) }
    });

    return NextResponse.json({ success: true, trilha: trilhaArray });

  } catch (error) {
    console.error("Erro na OpenAI:", error);
    return NextResponse.json({ error: "Falha ao gerar trilha" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "b6b43411-fe62-4966-ac48-1cfd906d2e85";

  // Calcular a semana atual (Ex: "2026-W37")
  const date = new Date();
  const weekNumber = Math.ceil(Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000)) / 7);
  const semana = `${date.getFullYear()}-W${weekNumber}`;

  try {
    const trilha = await prisma.trilhaDaSemana.findUnique({
      where: {
        userId_semana: {
          userId,
          semana,
        }
      }
    });

    if (!trilha) {
      return NextResponse.json({ success: false, message: "Trilha não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, trilha: JSON.parse(trilha.trilha) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

import { randomUUID } from "node:crypto";
import {
  approvedQuestions,
  publicQuestion,
  sampleQuestions,
} from "@/lib/catalogue";
import { createAttempt } from "@/lib/study";
import { getDb } from "@/lib/database.mjs";
import { currentUser, failure, HttpError, noStore, jsonBody } from "@/lib/http";
export const dynamic = "force-dynamic";
async function selectQuestions(req: Request, excludedIds: string[] = []) {
  try {
    const params = new URL(req.url).searchParams,
      subject = params.get("materia"),
      simulado = params.get("simulado");
    if (simulado && !["geral-do-dia", "enem-2022-oficial"].includes(simulado))
      throw new HttpError(
        404,
        "Este simulado não está disponível no acervo revisado.",
      );
    if (params.get("catalogo") === "1") {
      const all = approvedQuestions();
      return noStore({
        success: true,
        total: all.length,
        subjects: [...new Set(all.map((q) => q.materia))].map((name) => ({
          name,
          count: all.filter((q) => q.materia === name).length,
        })),
        years: [...new Set(all.map((q) => q.source.year))].sort(),
      });
    }
    const yearParam = params.get("ano");
    const year = yearParam ? Number(yearParam) : undefined;
    if (
      yearParam &&
      (!/^\d{4}$/.test(yearParam) ||
        !approvedQuestions().some((q) => q.source.year === year))
    )
      throw new HttpError(400, "Escolha um ano disponível no acervo.");
    const count = Number(params.get("quantidade") || 10);
    if (![5, 10, 20].includes(count))
      throw new HttpError(400, "Escolha uma rodada de 5, 10 ou 20 questões.");
    const user = await currentUser(req);
    const excluded = excludedIds;
    if (user) {
      const recent = await (
        await getDb()
      ).execute({
        sql: "SELECT questionId FROM answers WHERE userId=? ORDER BY createdAt DESC LIMIT 2000",
        args: [user.id],
      });
      excluded.push(...recent.rows.map((r) => String(r.questionId)));
    }
    const legacy = simulado === "enem-2022-oficial";
    const pool = approvedQuestions(subject).filter(
      (q) => !year || q.source.year === year,
    );
    // Preserve old links as the original text-only selection, including immutable IDs.
    const qs = legacy
      ? approvedQuestions(subject).filter(
          (q) => q.source.year === 2022 && !q.media,
        )
      : sampleQuestions(subject, count, year, excluded);
    if (!qs.length)
      throw new HttpError(
        404,
        "Ainda não há questões revisadas para esta matéria.",
      );
    const attemptId = user ? await createAttempt(user.id, qs) : randomUUID();
    return noStore({
      success: true,
      questoes: qs.map(publicQuestion),
      attemptId,
      persisted: Boolean(user),
      available: legacy ? qs.length : pool.length,
      unseen: pool.filter((q) => !excluded.includes(q.id)).length,
    });
  } catch (e) {
    return failure(e);
  }
}
export async function GET(req: Request) {
  return selectQuestions(req);
}
export async function POST(req: Request) {
  try {
    const body = await jsonBody(req, 300000);
    if (
      !Array.isArray(body.excluded) ||
      body.excluded.length > 2000 ||
      body.excluded.some((id) => typeof id !== "string" || id.length > 128)
    )
      throw new HttpError(400, "Histórico de seleção inválido.");
    return selectQuestions(req, body.excluded as string[]);
  } catch (e) {
    return failure(e);
  }
}

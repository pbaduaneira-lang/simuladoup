import { randomUUID } from "node:crypto";
import {
  approvedQuestions,
  publicQuestion,
  sampleQuestions,
} from "@/lib/catalogue";
import { createAttempt } from "@/lib/study";
import { currentUser, failure, HttpError, noStore } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
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
        years: [2022],
      });
    }
    const qs = sampleQuestions(
      subject,
      simulado === "enem-2022-oficial" ? 41 : 10,
    );
    if (!qs.length)
      throw new HttpError(
        404,
        "Ainda não há questões revisadas para esta matéria.",
      );
    const user = await currentUser(req),
      attemptId = user ? await createAttempt(user.id, qs) : randomUUID();
    return noStore({
      success: true,
      questoes: qs.map(publicQuestion),
      attemptId,
      persisted: Boolean(user),
    });
  } catch (e) {
    return failure(e);
  }
}

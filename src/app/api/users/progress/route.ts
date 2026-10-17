import { questionById, validateAnswer } from "@/lib/catalogue";
import { currentUser, failure, HttpError, jsonBody, noStore } from "@/lib/http";
import { recordAnswer } from "@/lib/study";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const body = await jsonBody(req);
    if ("userId" in body || "acertou" in body)
      throw new HttpError(
        400,
        "Envie somente a tentativa e a alternativa escolhida.",
      );
    if (
      typeof body.questionId !== "string" ||
      typeof body.attemptId !== "string" ||
      !/^[a-f0-9-]{36}$/i.test(body.attemptId)
    )
      throw new HttpError(400, "Tentativa inválida.");
    const user = await currentUser(req);
    const result = user
      ? await recordAnswer(
          user.id,
          body.attemptId,
          body.questionId,
          body.selectedOption,
          body.tempo,
        )
      : {
          ...validateAnswer(
            questionById(body.questionId),
            body.selectedOption,
            body.tempo,
          ),
          xpGained: 0,
          persisted: false,
          replayed: false,
        };
    return noStore({ success: true, ...result });
  } catch (e) {
    return failure(e);
  }
}

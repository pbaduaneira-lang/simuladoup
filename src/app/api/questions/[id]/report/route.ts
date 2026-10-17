import { randomUUID } from "node:crypto";
import { writeTransaction } from "@/lib/database.mjs";
import { questionById } from "@/lib/catalogue";
import { failure, HttpError, jsonBody, noStore, requireUser } from "@/lib/http";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser(req),
      q = questionById((await params).id),
      body = await jsonBody(req);
    if (
      Object.keys(body).some((k) => k !== "reason") ||
      typeof body.reason !== "string" ||
      body.reason.trim().length < 5 ||
      body.reason.length > 1000
    )
      throw new HttpError(400, "Descreva o problema em 5 a 1000 caracteres.");
    const reason = body.reason.trim();
    await writeTransaction(async (tx) => {
      const count = Number(
        (
          await tx.execute({
            sql: "SELECT COUNT(*) AS count FROM question_reports WHERE userId=? AND createdAt>?",
            args: [user.id, new Date(Date.now() - 3600000).toISOString()],
          })
        ).rows[0].count,
      );
      if (count >= 5)
        throw new HttpError(
          429,
          "Você já enviou cinco observações nesta hora. Aguarde para enviar outra.",
        );
      await tx.execute({
        sql: "INSERT INTO question_reports(id,userId,questionId,questionVersion,reason,createdAt) VALUES(?,?,?,?,?,?)",
        args: [
          randomUUID(),
          user.id,
          q.id,
          q.version,
          reason,
          new Date().toISOString(),
        ],
      });
    });
    return noStore({ success: true });
  } catch (e) {
    return failure(e);
  }
}

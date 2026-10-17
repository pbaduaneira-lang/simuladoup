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
    if (typeof body.liked !== "boolean" || Object.keys(body).length !== 1)
      throw new HttpError(400, "Preferência inválida.");
    await writeTransaction(async (tx) => {
      await tx.execute({
        sql: body.liked
          ? "INSERT INTO question_likes(userId,questionId) VALUES(?,?) ON CONFLICT DO NOTHING"
          : "DELETE FROM question_likes WHERE userId=? AND questionId=?",
        args: [user.id, q.id],
      });
    });
    return noStore({ success: true, liked: body.liked });
  } catch (e) {
    return failure(e);
  }
}

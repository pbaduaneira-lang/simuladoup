import { getDb, writeTransaction } from "@/lib/database.mjs";
import { failure, HttpError, jsonBody, noStore, requireUser } from "@/lib/http";
import { userStats } from "@/lib/study";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const user = await requireUser(req),
      db = await getDb(),
      profile = (
        await db.execute({
          sql: "SELECT cidade,ondeEstuda,meta,rankingOptIn FROM profiles WHERE userId=?",
          args: [user.id],
        })
      ).rows[0];
    return noStore({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, ...profile },
      stats: await userStats(user.id),
    });
  } catch (e) {
    return failure(e);
  }
}
export async function PATCH(req: Request) {
  try {
    const user = await requireUser(req),
      body = await jsonBody(req),
      allowed = ["name", "cidade", "ondeEstuda", "meta", "rankingOptIn"];
    if (Object.keys(body).some((k) => !allowed.includes(k)))
      throw new HttpError(400, "Campo não permitido.");
    for (const [k, v] of Object.entries(body)) {
      if (k === "rankingOptIn") {
        if (typeof v !== "boolean")
          throw new HttpError(400, "Preferência inválida.");
      } else if (
        typeof v !== "string" ||
        v.trim().length > 120 ||
        (k === "name" && v.trim().length < 2)
      )
        throw new HttpError(400, "Confira os dados do perfil.");
    }
    await writeTransaction(async (tx) => {
      await tx.execute({
        sql: "INSERT INTO profiles(userId) VALUES(?) ON CONFLICT(userId) DO NOTHING",
        args: [user.id],
      });
      if (typeof body.name === "string")
        await tx.execute({
          sql: "UPDATE user SET name=?,updatedAt=? WHERE id=?",
          args: [body.name.trim(), Date.now(), user.id],
        });
      for (const k of ["cidade", "ondeEstuda", "meta", "rankingOptIn"])
        if (k in body)
          await tx.execute({
            sql: `UPDATE profiles SET ${k}=? WHERE userId=?`,
            args: [
              k === "rankingOptIn" ? (body[k] ? 1 : 0) : String(body[k]).trim(),
              user.id,
            ],
          });
    });
    return noStore({ success: true });
  } catch (e) {
    return failure(e);
  }
}

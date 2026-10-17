import { getDb } from "@/lib/database.mjs";
import { failure, noStore, requireUser } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const user = await requireUser(req),
      db = await getDb(),
      rows = (
        await db.execute(
          "SELECT u.id,u.name,COALESCE(SUM(a.xpAwarded),0) AS xp FROM user u JOIN profiles p ON p.userId=u.id AND p.rankingOptIn=1 LEFT JOIN answers a ON a.userId=u.id GROUP BY u.id,u.name ORDER BY xp DESC,u.id LIMIT 50",
        )
      ).rows;
    return noStore({
      users: rows.map((r) => ({
        name: String(r.name).trim().split(/\s+/)[0].slice(0, 30),
        xp: Number(r.xp),
        isMe: r.id === user.id,
      })),
    });
  } catch (e) {
    return failure(e);
  }
}

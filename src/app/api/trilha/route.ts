import { getDb } from "@/lib/database.mjs";
import { questionById } from "@/lib/catalogue";
import { failure, noStore, requireUser } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const user = await requireUser(req),
      db = await getDb(),
      rows = (
        await db.execute({
          sql: "SELECT questionId,COUNT(*) AS errors FROM answers WHERE userId=? AND acertou=0 GROUP BY questionId",
          args: [user.id],
        })
      ).rows;
    const counts = new Map<string, number>();
    for (const row of rows) {
      try {
        const q = questionById(String(row.questionId));
        counts.set(
          q.materia,
          (counts.get(q.materia) || 0) + Number(row.errors),
        );
      } catch {
        /* Archived questions cannot enter the study feed. */
      }
    }
    return noStore({
      success: true,
      trilha: [...counts]
        .map(([name, errors]) => ({ name, errors }))
        .sort((a, b) => b.errors - a.errors),
    });
  } catch (e) {
    return failure(e);
  }
}

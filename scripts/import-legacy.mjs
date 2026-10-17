import { readFile } from "node:fs/promises";
import { getDb } from "../src/lib/database.mjs";
const path = process.argv[2];
if (!path)
  throw Error(
    "Uso: node --env-file-if-exists=.env.local scripts/import-legacy.mjs caminho/exportacao.json",
  );
const data = JSON.parse(await readFile(path, "utf8"));
const tables = Object.entries(data);
if (
  tables.some(
    ([name, rows]) =>
      ![
        "User",
        "UserAnswer",
        "Question",
        "Simulado",
        "QuestionLike",
        "QuestionComment",
        "QuestionReport",
        "DailyGoal",
        "TrilhaDaSemana",
        "BattleRoom",
        "PlanoEstudo",
        "Pill",
        "UserPillInteraction",
      ].includes(name) || !Array.isArray(rows),
  )
)
  throw Error("Formato de exportação não reconhecido.");
const db = await getDb(),
  tx = await db.transaction("write");
let count = 0;
try {
  for (const [table, rows] of tables)
    for (const row of rows) {
      if (!row || typeof row.id !== "string")
        throw Error("Registro sem identificador.");
      await tx.execute({
        sql: "INSERT INTO legacy_imports(source,sourceId,payload,importedAt) VALUES(?,?,?,?) ON CONFLICT(source,sourceId) DO NOTHING",
        args: [
          `supabase:${table}`,
          row.id,
          JSON.stringify(row),
          new Date().toISOString(),
        ],
      });
      count++;
    }
  await tx.commit();
  console.log(
    `${count} registros processados no arquivo de preservação. Nenhuma conta, gabarito ou XP foi sobrescrito.`,
  );
} catch (e) {
  await tx.rollback();
  throw e;
} finally {
  tx.close();
  db.close();
}

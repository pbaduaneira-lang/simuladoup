// Read-only export. Do not remove the source project after export without verifying the backup.
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key)
  throw Error(
    "Configure a URL e a service-role key do projeto antigo em um ambiente local protegido.",
  );
const target = process.argv[2] || ".data/supabase-export.json";
const output = {};
for (const table of [
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
]) {
  output[table] = [];
  for (let offset = 0; ; offset += 500) {
    const endpoint = new URL(`/rest/v1/${table}`, url);
    endpoint.searchParams.set("select", "*");
    endpoint.searchParams.set("order", "id.asc");
    endpoint.searchParams.set("limit", "500");
    endpoint.searchParams.set("offset", String(offset));
    const res = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok)
      throw Error(
        `Exportação interrompida na tabela ${table}. Nenhum backup parcial foi salvo.`,
      );
    const rows = await res.json();
    if (!Array.isArray(rows)) throw Error("Formato inesperado.");
    output[table].push(...rows);
    if (rows.length < 500) break;
  }
}
await mkdir(dirname(target), { recursive: true });
await writeFile(target, JSON.stringify(output, null, 2), { flag: "wx" });
console.log(
  "Exportação concluída. O arquivo contém dados pessoais: mantenha-o fora do Git e confira as contagens antes de migrar.",
);

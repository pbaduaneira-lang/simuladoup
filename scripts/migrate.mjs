import { getDb } from "../src/lib/database.mjs";
try {
  const db = await getDb();
  console.log("Esquema do banco atualizado, sem exclusão de registros.");
  db.close();
} catch {
  console.error(
    "Não foi possível configurar o banco. Confira TURSO_DATABASE_URL e TURSO_AUTH_TOKEN.",
  );
  process.exitCode = 1;
}

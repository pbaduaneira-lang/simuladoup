import { createClient } from "@libsql/client";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { schemaStatements } from "./schema.mjs";
/** @type {Promise<import('@libsql/client').Client> | undefined} */
let clientPromise;
export function databaseConfig() {
  const url = process.env.TURSO_DATABASE_URL;
  if (
    process.env.NODE_ENV === "production" &&
    (!url || !/^(libsql|https):\/\//.test(url) || !process.env.TURSO_AUTH_TOKEN)
  ) {
    throw new Error(
      "Configure TURSO_DATABASE_URL e TURSO_AUTH_TOKEN para habilitar contas.",
    );
  }
  return {
    url: url || "file:.data/simuladoup.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  };
}
export async function getDb() {
  if (!clientPromise)
    clientPromise = (async () => {
      const config = databaseConfig();
      if (config.url.startsWith("file:"))
        await mkdir(dirname(resolve(config.url.slice(5))), { recursive: true });
      const client = createClient(config);
      await client.execute("PRAGMA foreign_keys = ON");
      await client.batch(schemaStatements, "write");
      return client;
    })().catch((e) => {
      clientPromise = undefined;
      throw e;
    });
  return clientPromise;
}
/** @template T @param {(tx: import('@libsql/client').Transaction) => Promise<T>} fn @returns {Promise<T>} */
export async function writeTransaction(fn) {
  const db = await getDb();
  for (let attempt = 0; attempt < 3; attempt++) {
    /** @type {import('@libsql/client').Transaction | undefined} */
    let tx;
    try {
      tx = await db.transaction("write");
      const result = await fn(tx);
      await tx.commit();
      return result;
    } catch (e) {
      await tx?.rollback().catch(() => {});
      if (
        attempt === 2 ||
        !/SQLITE_BUSY|SQLITE_BUSY_SNAPSHOT|TRANSACTION_CONFLICT/.test(
          String(e.code),
        )
      )
        throw e;
      await new Promise((resolve) => setTimeout(resolve, 30 * (attempt + 1)));
    } finally {
      tx?.close();
    }
  }
  throw new Error("Transaction retry exhausted");
}

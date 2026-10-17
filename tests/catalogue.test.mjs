import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseAnswerKey, requireAnswer } from "../scripts/lib/exam-key.mjs";
test("Catálogo aprovado confere gabaritos, origem, duplicatas e hash de todas as versões", () => {
  assert.match(
    execFileSync(process.execPath, ["scripts/check-catalogue.mjs"], {
      encoding: "utf8",
    }),
    /41 questões/,
  );
});
test("Anulado nunca vira A; inglês e espanhol não compartilham a mesma chave", () => {
  const keys = parseAnswerKey(
    "1 B A\n2 B A\n3 D E\n4 A B\n5 B A\n177 Anulado\n115 ANULADA",
  );
  assert.deepEqual(requireAnswer(keys, 177), {
    status: "ANNULLED",
    correta: null,
  });
  assert.deepEqual(requireAnswer(keys, 115), {
    status: "ANNULLED",
    correta: null,
  });
  assert.equal(requireAnswer(keys, 1, "ingles").correta, 1);
  assert.equal(requireAnswer(keys, 1, "espanhol").correta, 0);
  assert.equal(requireAnswer(keys, 3, "espanhol").correta, 4);
  assert.throws(() => requireAnswer(keys, 178), /ausente/);
  assert.throws(() => parseAnswerKey("6 A\n6 B"), /conflitantes/);
});
test("Arquivos antigos não possuem questões aprovadas e não mantêm gabaritos inventados para anuladas", () => {
  for (const name of [
    "enem_2025_clean.json",
    "enem_2025_questoes.json",
    "enem_multi_anos.json",
  ]) {
    const qs = JSON.parse(
      readFileSync(new URL(`../scripts/${name}`, import.meta.url), "utf8"),
    );
    assert.ok(
      qs.every((q) => q.status === "QUARANTINED" || q.status === "ANNULLED"),
    );
    assert.ok(
      qs
        .filter((q) => q.status === "ANNULLED")
        .every((q) => q.correta === null),
    );
  }
});

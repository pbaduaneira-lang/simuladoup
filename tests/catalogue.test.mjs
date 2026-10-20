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
    /\d+ questões: gabaritos, origem, unicidade e versões conferidos/,
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
test("Texto compartilhado de 2025 acompanha todas as questões 6 a 10", () => {
  const qs = JSON.parse(
    readFileSync(
      new URL("../src/data/approved-questions.json", import.meta.url),
      "utf8",
    ),
  );
  const audit = JSON.parse(
    readFileSync(
      new URL("../src/data/catalogue-provenance.json", import.meta.url),
      "utf8",
    ),
  );
  for (let n = 6; n <= 10; n++) {
    const q = qs.find(
      (q) =>
        q.source.year === 2025 && q.source.day === 1 && q.source.number === n,
    );
    assert.ok(q);
    const crop = audit.crops.find((c) => c.questionId === q.id);
    assert.equal(crop.segments.length, 2);
    assert.equal(crop.segments[0].page, 6);
    assert.equal(crop.segments[1].page, 7);
    assert.ok(q.media.height > 2000);
  }
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

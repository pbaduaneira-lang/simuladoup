import test from "node:test";
import assert from "node:assert/strict";
import { serviceDiagnostic } from "../src/lib/service-diagnostics.mjs";
const valid = {
  TURSO_DATABASE_URL: "libsql://example.turso.io",
  TURSO_AUTH_TOKEN: "token-privado",
  BETTER_AUTH_SECRET: "segredo-privado-com-mais-de-32-caracteres",
  BETTER_AUTH_URL: "https://www.example.com.br",
};
test("Diagnóstico distingue configuração ausente ou inválida sem incluir valores", () => {
  assert.deepEqual(
    serviceDiagnostic(new Error("detalhe privado"), valid).issues,
    [],
  );
  const result = serviceDiagnostic(new Error("não deve sair no log"), {
    ...valid,
    BETTER_AUTH_SECRET: "curto",
    BETTER_AUTH_URL: "www.example.com.br",
    TURSO_AUTH_TOKEN: undefined,
  });
  assert.ok(result.issues.includes("BETTER_AUTH_SECRET_TOO_SHORT"));
  assert.ok(result.issues.includes("BETTER_AUTH_URL_INVALID"));
  assert.ok(result.issues.includes("TURSO_AUTH_TOKEN_MISSING"));
  assert.ok(!JSON.stringify(result).includes("curto"));
  assert.ok(!JSON.stringify(result).includes("não deve sair no log"));
});
test("Diagnóstico preserva HTTP 401 de causa aninhada e não vaza token, SQL ou classe arbitrária", () => {
  const error = Object.assign(new Error(valid.TURSO_AUTH_TOKEN), {
    name: valid.BETTER_AUTH_SECRET,
    code: "SERVER_ERROR",
    cause: Object.assign(new Error("select email from user"), {
      status: 401,
      code: valid.TURSO_AUTH_TOKEN,
    }),
  });
  const result = serviceDiagnostic(error, valid);
  assert.equal(result.causes[0].code, "SERVER_ERROR");
  assert.equal(result.causes[1].status, 401);
  for (const value of Object.values(valid))
    assert.ok(!JSON.stringify(result).includes(value));
  assert.ok(!JSON.stringify(result).includes("select email"));
});
test("Diagnóstico limita causas cíclicas e sinaliza espaços na configuração", () => {
  const error = { code: "SQLITE_READONLY" };
  error.cause = error;
  const result = serviceDiagnostic(error, {
    ...valid,
    TURSO_AUTH_TOKEN: " token-privado ",
  });
  assert.equal(result.causes.length, 4);
  assert.deepEqual(result.issues, ["TURSO_AUTH_TOKEN_SURROUNDING_WHITESPACE"]);
});

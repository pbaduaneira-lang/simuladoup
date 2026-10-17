import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
const questions = JSON.parse(
  readFileSync(
    new URL("../src/data/approved-questions.json", import.meta.url),
    "utf8",
  ),
);
const freePort = () =>
  new Promise((resolve) => {
    const server = createServer();
    server.listen(0, "0.0.0.0", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
test(
  "Fluxos reais: navegador HTTP → APIs → libSQL → resultados",
  { timeout: 240000 },
  async (t) => {
    const port = await freePort(),
      base = `http://localhost:${port}`,
      dbPath = `.data/test-${randomUUID()}.db`;
    const child = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "dev",
        "--webpack",
        "-p",
        String(port),
        "-H",
        "0.0.0.0",
      ],
      {
        env: {
          ...process.env,
          NODE_ENV: "development",
          TURSO_DATABASE_URL: `file:${dbPath}`,
          TURSO_AUTH_TOKEN: "",
          BETTER_AUTH_URL: base,
          BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
        },
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      },
    );
    let log = "";
    child.stdout.on("data", (b) => (log = (log + b.toString()).slice(-15000)));
    child.stderr.on("data", (b) => (log = (log + b.toString()).slice(-15000)));
    t.after(() => {
      child.kill();
    });
    let ready = false;
    for (let i = 0; i < 120; i++) {
      try {
        const r = await fetch(base + "/api/questions?catalogo=1");
        if (r.ok) {
          ready = true;
          break;
        }
      } catch {}
      if (child.exitCode !== null) throw Error(log);
      await wait(300);
    }
    assert.ok(ready, log);
    function client() {
      let cookies = new Map();
      return {
        async request(path, { method = "GET", body, origin = base } = {}) {
          const res = await fetch(base + path, {
            method,
            headers: {
              Origin: origin,
              ...(body ? { "Content-Type": "application/json" } : {}),
              Cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join("; "),
            },
            body: body ? JSON.stringify(body) : undefined,
          });
          for (const value of res.headers.getSetCookie()) {
            const pair = value.split(";")[0],
              at = pair.indexOf("=");
            cookies.set(pair.slice(0, at), pair.slice(at + 1));
          }
          const raw = await res.text();
          let data;
          try {
            data = JSON.parse(raw);
          } catch {
            data = { raw: raw.slice(0, 500) };
          }
          return { status: res.status, data };
        },
        clear() {
          cookies = new Map();
        },
      };
    }
    const guest = client(),
      a = client(),
      b = client();
    let first;
    await t.test(
      "Prática sem conta tem alternativas completas, sem gabarito no carregamento",
      async () => {
        const r = await guest.request("/api/questions");
        assert.equal(r.status, 200, JSON.stringify(r.data));
        assert.equal(r.data.persisted, false);
        assert.ok(r.data.questoes.length);
        first = r.data;
        for (const q of first.questoes) {
          assert.equal(q.alternativas.length, 5);
          assert.equal("correta" in q, false);
          assert.equal("explicacaoIA" in q, false);
          assert.ok(q.version && q.source.answerKeyUrl);
        }
      },
    );
    await t.test(
      "API valida alternativa, origem e questão; não aceita acerto informado pelo cliente",
      async () => {
        const id = first.questoes[0].id,
          body = {
            attemptId: first.attemptId,
            questionId: id,
            selectedOption: 0,
            tempo: 3,
          };
        for (const change of [
          { acertou: true },
          { userId: "outra-pessoa" },
          { selectedOption: "0" },
          { selectedOption: 99 },
          { tempo: -1 },
          { questionId: "importacao-antiga" },
        ]) {
          const r = await guest.request("/api/users/progress", {
            method: "POST",
            body: { ...body, ...change },
          });
          assert.ok([400, 404].includes(r.status), JSON.stringify(r));
        }
        assert.equal(
          (
            await guest.request("/api/users/progress", {
              method: "POST",
              origin: "https://outro-site.invalid",
              body,
            })
          ).status,
          403,
        );
        const expected = questions.find((q) => q.id === id),
          answer = await guest.request("/api/users/progress", {
            method: "POST",
            body: { ...body, selectedOption: expected.correta },
          });
        assert.equal(answer.status, 200);
        assert.equal(answer.data.acertou, true);
        assert.equal(answer.data.persisted, false);
        assert.equal(answer.data.xpGained, 0);
      },
    );
    await t.test(
      "Não há troca silenciosa de simulado inexistente; perfil e relatório exigem login",
      async () => {
        assert.equal(
          (await guest.request("/api/questions?simulado=nao-existe")).status,
          404,
        );
        assert.equal(
          (await guest.request("/api/questions?materia=matematica")).status,
          404,
        );
        assert.equal(
          (
            await guest.request("/api/users/me", {
              method: "PATCH",
              body: { userId: "alvo", xp: 999999, plano: "PRO" },
            })
          ).status,
          401,
        );
        assert.equal(
          (
            await guest.request(
              `/api/questions/${first.questoes[0].id}/report`,
              { method: "POST", body: { reason: "Revisar texto" } },
            )
          ).status,
          401,
        );
      },
    );
    await t.test(
      "Cadastro e sessão usam o banco real; tentativas pertencem ao usuário autenticado",
      async () => {
        for (const [c, name] of [
          [a, "Pessoa A"],
          [b, "Pessoa B"],
        ]) {
          const r = await c.request("/api/auth/sign-up/email", {
            method: "POST",
            body: {
              name,
              email: `${randomUUID()}@example.test`,
              password: "Senha-de-teste-longa-123!",
            },
          });
          assert.equal(r.status, 200, JSON.stringify(r.data));
          const profile = await c.request("/api/users/me");
          assert.equal(profile.status, 200, JSON.stringify(profile.data));
          assert.equal(profile.data.user.name, name);
          assert.equal(profile.data.stats.total, 0);
        }
      },
    );
    let attempt;
    await t.test(
      "Resposta E funciona e gabarito permanece associado à versão exibida",
      async () => {
        const r = await a.request("/api/questions?simulado=enem-2022-oficial");
        assert.equal(r.status, 200, JSON.stringify(r.data));
        assert.equal(r.data.persisted, true);
        attempt = r.data;
        const q = r.data.questoes.find(
            (q) => questions.find((c) => c.id === q.id).correta === 4,
          ),
          body = {
            attemptId: r.data.attemptId,
            questionId: q.id,
            selectedOption: 4,
            tempo: 7,
          };
        const concurrent = await Promise.all([
          a.request("/api/users/progress", { method: "POST", body }),
          a.request("/api/users/progress", { method: "POST", body }),
        ]);
        for (const result of concurrent)
          assert.equal(result.status, 200, JSON.stringify(result.data));
        const response = concurrent[0];
        assert.equal(response.status, 200, JSON.stringify(response.data));
        assert.equal(response.data.acertou, true);
        assert.equal(response.data.correta, 4);
        assert.equal(response.data.xpGained, 10);
        assert.equal(response.data.questionVersion, q.version);
        const replay = await a.request("/api/users/progress", {
          method: "POST",
          body,
        });
        assert.equal(replay.status, 200);
        assert.equal(replay.data.replayed, true);
        const conflict = await a.request("/api/users/progress", {
          method: "POST",
          body: { ...body, selectedOption: 0 },
        });
        assert.equal(conflict.status, 409);
        assert.equal(
          (await b.request("/api/users/progress", { method: "POST", body }))
            .status,
          404,
        );
        const me = await a.request("/api/users/me");
        assert.equal(me.data.stats.total, 1);
        assert.equal(me.data.stats.xp, 10);
      },
    );
    await t.test(
      "Todas as alternativas são corrigidas com o conteúdo oficial e a tentativa encerra",
      async () => {
        for (const q of attempt.questoes) {
          const expected = questions.find((c) => c.id === q.id);
          const r = await a.request("/api/users/progress", {
            method: "POST",
            body: {
              attemptId: attempt.attemptId,
              questionId: q.id,
              selectedOption: expected.correta,
              tempo: 2,
            },
          });
          assert.equal(r.status, 200, JSON.stringify(r.data));
          assert.equal(r.data.acertou, true);
          assert.equal(r.data.correta, expected.correta);
        }
        const me = await a.request("/api/users/me");
        assert.equal(me.data.stats.total, 41);
        assert.equal(me.data.stats.correct, 41);
        assert.equal(me.data.stats.xp, 410);
        const db = createClient({ url: `file:${dbPath}` });
        const row = (
          await db.execute({
            sql: "SELECT completedAt FROM attempts WHERE id=?",
            args: [attempt.attemptId],
          })
        ).rows[0];
        assert.ok(row.completedAt);
        db.close();
      },
    );
    await t.test(
      "Novo estudo da mesma questão no dia não duplica XP; perfil não aceita campos privilegiados",
      async () => {
        const r = await a.request("/api/questions");
        const q = r.data.questoes[0],
          expected = questions.find((c) => c.id === q.id);
        const answer = await a.request("/api/users/progress", {
          method: "POST",
          body: {
            attemptId: r.data.attemptId,
            questionId: q.id,
            selectedOption: expected.correta,
            tempo: 1,
          },
        });
        assert.equal(answer.data.xpGained, 0);
        assert.equal(
          (
            await a.request("/api/users/me", {
              method: "PATCH",
              body: { xp: 9999 },
            })
          ).status,
          400,
        );
        assert.equal(
          (
            await a.request("/api/users/me", {
              method: "PATCH",
              body: { name: "Aluno Seguro", meta: "ENEM", rankingOptIn: true },
            })
          ).status,
          200,
        );
        const profile = await a.request("/api/users/me");
        assert.equal(profile.data.user.name, "Aluno Seguro");
        const rank = await a.request("/api/ranking");
        assert.equal(rank.status, 200);
        assert.equal(rank.data.users[0].name, "Aluno");
        assert.equal(rank.data.users[0].xp, 410);
        assert.equal("email" in rank.data.users[0], false);
      },
    );
    await t.test(
      "Relatório mantém versão e usa usuário da sessão",
      async () => {
        assert.equal(
          (
            await a.request(`/api/questions/${first.questoes[0].id}/report`, {
              method: "POST",
              body: { reason: "Quero confirmar esta explicação." },
            })
          ).status,
          200,
        );
      },
    );
    const host = client(),
      visitor = client(),
      outsider = client();
    let room;
    await t.test(
      "Desafio cria, entra e recusa terceiro participante ou pontuação fornecida pelo cliente",
      async () => {
        const r = await host.request("/api/battles", {
          method: "POST",
          body: {},
        });
        assert.equal(r.status, 200, JSON.stringify(r.data));
        room = r.data.id;
        assert.equal(
          (
            await visitor.request(`/api/battles/${room}`, {
              method: "POST",
              body: { action: "join" },
            })
          ).status,
          200,
        );
        assert.equal(
          (
            await outsider.request(`/api/battles/${room}`, {
              method: "POST",
              body: { action: "join" },
            })
          ).status,
          409,
        );
        const v = await host.request(`/api/battles/${room}`);
        assert.equal("correta" in v.data.question, false);
        assert.equal(
          (
            await host.request(`/api/battles/${room}`, {
              method: "POST",
              body: {
                action: "answer",
                questionId: v.data.question.id,
                selectedOption: 0,
                points: 999,
              },
            })
          ).status,
          400,
        );
      },
    );
    await t.test(
      "Dois participantes concluem com pontuação calculada no servidor e sem duplicação",
      async () => {
        for (const c of [host, visitor])
          for (let i = 0; i < 5; i++) {
            const view = await c.request(`/api/battles/${room}`),
              q = view.data.question,
              expected = questions.find((item) => item.id === q.id),
              body = {
                action: "answer",
                questionId: q.id,
                selectedOption: expected.correta,
              };
            assert.equal(
              (
                await c.request(`/api/battles/${room}`, {
                  method: "POST",
                  body,
                })
              ).status,
              200,
            );
            assert.equal(
              (
                await c.request(`/api/battles/${room}`, {
                  method: "POST",
                  body,
                })
              ).status,
              200,
            );
          }
        const view = await host.request(`/api/battles/${room}`);
        assert.equal(view.data.finished, true);
        assert.equal(view.data.myScore, 50);
        assert.equal(view.data.opponentScore, 50);
        assert.equal(view.data.question, null);
      },
    );
    await t.test(
      "Uma tentativa antiga usa sua versão preservada, e conteúdo corrompido falha sem corrigir",
      async () => {
        const profile = await b.request("/api/users/me"),
          userId = profile.data.user.id,
          original = questions[0];
        const {
          id: originalId,
          version: originalVersion,
          ...content
        } = original;
        assert.ok(originalVersion);
        content.alternativas = [
          ...original.alternativas.slice(1),
          original.alternativas[0],
        ];
        content.correta = (original.correta + 4) % 5;
        const canonical = (value) =>
          Array.isArray(value)
            ? value.map(canonical)
            : value && typeof value === "object"
              ? Object.fromEntries(
                  Object.keys(value)
                    .sort()
                    .map((k) => [k, canonical(value[k])]),
                )
              : value;
        const version = createHash("sha256")
            .update(JSON.stringify(canonical(content)))
            .digest("hex"),
          id = originalId.slice(0, -16) + version.slice(0, 16),
          q = { ...content, id, version };
        const db = createClient({ url: `file:${dbPath}` }),
          attemptId = randomUUID();
        await db.batch(
          [
            {
              sql: "INSERT INTO question_versions(id,version,sourceKey,content,createdAt) VALUES(?,?,?,?,?)",
              args: [
                id,
                version,
                "test:historical",
                JSON.stringify(q),
                new Date().toISOString(),
              ],
            },
            {
              sql: "INSERT INTO attempts(id,userId,questionIds,createdAt) VALUES(?,?,?,?)",
              args: [
                attemptId,
                userId,
                JSON.stringify([id]),
                new Date().toISOString(),
              ],
            },
          ],
          "write",
        );
        const body = {
            attemptId,
            questionId: id,
            selectedOption: q.correta,
            tempo: 1,
          },
          answer = await b.request("/api/users/progress", {
            method: "POST",
            body,
          });
        assert.equal(answer.status, 200, JSON.stringify(answer.data));
        assert.equal(answer.data.acertou, true);
        assert.equal(answer.data.questionVersion, version);
        await db.execute({
          sql: "UPDATE question_versions SET content=? WHERE id=?",
          args: [
            JSON.stringify({ ...q, enunciado: q.enunciado + " ALTERADO" }),
            id,
          ],
        });
        assert.equal(
          (await b.request("/api/users/progress", { method: "POST", body }))
            .status,
          503,
        );
        db.close();
      },
    );
    await t.test(
      "Excluir conta exige senha e remove conta, sessões e histórico",
      async () => {
        const accountId = (await a.request("/api/users/me")).data.user.id;
        const bad = await a.request("/api/auth/delete-user", {
          method: "POST",
          body: { password: "senha-incorreta" },
        });
        assert.notEqual(bad.status, 200);
        const del = await a.request("/api/auth/delete-user", {
          method: "POST",
          body: { password: "Senha-de-teste-longa-123!" },
        });
        assert.equal(del.status, 200, JSON.stringify(del.data));
        assert.equal((await a.request("/api/users/me")).status, 401);
        const db = createClient({ url: `file:${dbPath}` });
        for (const table of [
          "answers",
          "attempts",
          "profiles",
          "session",
          "account",
          "question_reports",
        ]) {
          const remaining = Number(
            (
              await db.execute({
                sql: `SELECT COUNT(*) AS count FROM ${table} WHERE userId=?`,
                args: [accountId],
              })
            ).rows[0].count,
          );
          assert.equal(
            remaining,
            0,
            `Registros pessoais restantes em ${table}`,
          );
        }
        assert.equal(
          (
            await db.execute({
              sql: "SELECT id FROM user WHERE id=?",
              args: [accountId],
            })
          ).rows.length,
          0,
        );
        db.close();
      },
    );
  },
);

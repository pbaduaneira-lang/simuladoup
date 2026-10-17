import { randomUUID } from "node:crypto";
import { getDb, writeTransaction } from "./database.mjs";
import { Question, readQuestionSnapshot, validateAnswer } from "./catalogue";
import { HttpError } from "./http";
export function studyDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export async function createAttempt(userId: string, qs: Question[]) {
  const id = randomUUID(),
    now = new Date().toISOString();
  await writeTransaction(async (tx) => {
    for (const q of qs)
      await tx.execute({
        sql: "INSERT INTO question_versions(id,version,sourceKey,content,createdAt) VALUES(?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
        args: [
          q.id,
          q.version,
          `enem:${q.source.year}:${q.source.application}:${q.source.day}:${q.source.booklet}:${q.source.language || "geral"}:${q.source.number}`,
          JSON.stringify(q),
          now,
        ],
      });
    await tx.execute({
      sql: "INSERT INTO attempts(id,userId,questionIds,createdAt) VALUES(?,?,?,?)",
      args: [id, userId, JSON.stringify(qs.map((q) => q.id)), now],
    });
  });
  return id;
}
export async function recordAnswer(
  userId: string,
  attemptId: string,
  questionId: string,
  selected: unknown,
  tempo: unknown,
) {
  const date = studyDate();
  return writeTransaction(async (tx) => {
    const attempt = (
      await tx.execute({
        sql: "SELECT * FROM attempts WHERE id=? AND userId=?",
        args: [attemptId, userId],
      })
    ).rows[0];
    if (!attempt)
      throw new HttpError(
        404,
        "Tentativa não encontrada. Inicie um novo simulado.",
      );
    const ids = JSON.parse(String(attempt.questionIds)) as string[];
    if (!ids.includes(questionId))
      throw new HttpError(400, "Esta questão não pertence à tentativa.");
    const version = (
      await tx.execute({
        sql: "SELECT content FROM question_versions WHERE id=?",
        args: [questionId],
      })
    ).rows[0];
    if (!version)
      throw new HttpError(503, "A versão da questão está indisponível.");
    const q = readQuestionSnapshot(JSON.parse(String(version.content)));
    if (q.id !== questionId)
      throw new HttpError(
        503,
        "A referência desta questão está inconsistente.",
      );
    const answer = validateAnswer(q, selected, tempo);
    const stored = (
      await tx.execute({
        sql: "SELECT * FROM answers WHERE attemptId=? AND questionId=?",
        args: [attemptId, q.id],
      })
    ).rows[0];
    if (stored) {
      if (Number(stored.selectedOption) !== answer.selectedOption)
        throw new HttpError(
          409,
          "Esta questão já foi respondida nesta tentativa.",
        );
      return {
        ...answer,
        acertou: Boolean(stored.acertou),
        xpGained: Number(stored.xpAwarded),
        replayed: true,
        persisted: true,
      };
    }
    if (attempt.completedAt)
      throw new HttpError(409, "Esta tentativa já foi concluída.");
    const awarded =
      (
        await tx.execute({
          sql: "SELECT id FROM answers WHERE userId=? AND questionId=? AND date=? AND xpAwarded>0 LIMIT 1",
          args: [userId, q.id, date],
        })
      ).rows.length > 0;
    const xp = answer.acertou && !awarded ? 10 : 0;
    await tx.execute({
      sql: "INSERT INTO answers(id,attemptId,userId,questionId,questionVersion,selectedOption,correta,acertou,tempo,xpAwarded,date,createdAt) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
      args: [
        randomUUID(),
        attemptId,
        userId,
        q.id,
        q.version,
        answer.selectedOption,
        q.correta,
        answer.acertou ? 1 : 0,
        answer.tempo,
        xp,
        date,
        new Date().toISOString(),
      ],
    });
    const count = Number(
      (
        await tx.execute({
          sql: "SELECT COUNT(*) AS count FROM answers WHERE attemptId=?",
          args: [attemptId],
        })
      ).rows[0].count,
    );
    if (count === ids.length)
      await tx.execute({
        sql: "UPDATE attempts SET completedAt=? WHERE id=?",
        args: [new Date().toISOString(), attemptId],
      });
    return { ...answer, xpGained: xp, replayed: false, persisted: true };
  });
}
export async function userStats(userId: string) {
  const db = await getDb();
  const rows = (
    await db.execute({
      sql: "SELECT COUNT(*) AS total,COALESCE(SUM(acertou),0) AS correct,COALESCE(SUM(xpAwarded),0) AS xp FROM answers WHERE userId=?",
      args: [userId],
    })
  ).rows[0];
  const days = (
    await db.execute({
      sql: "SELECT DISTINCT date FROM answers WHERE userId=? ORDER BY date DESC",
      args: [userId],
    })
  ).rows.map((r) => String(r.date));
  const today = studyDate(),
    yesterday = studyDate(new Date(Date.now() - 86400000));
  let streak = 0,
    expected = days[0] === today ? today : yesterday;
  for (const day of days) {
    if (day !== expected) break;
    streak++;
    expected = studyDate(
      new Date(new Date(`${day}T12:00:00-03:00`).getTime() - 86400000),
    );
  }
  const count = Number(
    (
      await db.execute({
        sql: "SELECT COUNT(*) AS count FROM answers WHERE userId=? AND date=?",
        args: [userId, today],
      })
    ).rows[0].count,
  );
  return {
    total: Number(rows.total),
    correct: Number(rows.correct),
    xp: Number(rows.xp),
    streak,
    today: count,
  };
}

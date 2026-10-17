import { randomUUID } from "node:crypto";
import { getDb, writeTransaction } from "./database.mjs";
import { currentUser, HttpError } from "./http";
import {
  publicQuestion,
  questionById,
  sampleQuestions,
  validateAnswer,
  readQuestionSnapshot,
} from "./catalogue";
type Result = {
  questionId: string;
  selectedOption: number;
  acertou: boolean;
  correta: number;
  explicacaoIA: string;
  points: number;
};
type State = { p1: Result[]; p2: Result[] };
function roomQuestions(value: unknown) {
  const data = JSON.parse(String(value)) as unknown[];
  return data.map((q) =>
    typeof q === "string" ? questionById(q) : readQuestionSnapshot(q),
  );
}
export async function battleIdentity(req: Request) {
  const user = await currentUser(req);
  if (user) return { id: `user:${user.id}`, cookie: null };
  const match = req.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)up-battle=([a-f0-9-]{36})(?:;|$)/i);
  const id = match?.[1] || randomUUID();
  return { id: `guest:${id}`, cookie: match ? null : id };
}
function checkRoom(row: Record<string, unknown> | undefined) {
  if (!row) throw new HttpError(404, "Desafio não encontrado.");
  if (Date.now() - new Date(String(row.createdAt)).getTime() > 86400000)
    throw new HttpError(410, "Este desafio expirou. Crie uma nova sala.");
}
export async function newBattle(actor: string) {
  const id = randomUUID(),
    questions = sampleQuestions(null, 5);
  await writeTransaction(async (tx) => {
    await tx.execute({
      sql: "DELETE FROM battles WHERE createdAt<?",
      args: [new Date(Date.now() - 86400000).toISOString()],
    });
    const count = Number(
      (
        await tx.execute({
          sql: "SELECT COUNT(*) AS count FROM battles WHERE hostId=? AND createdAt>?",
          args: [actor, new Date(Date.now() - 3600000).toISOString()],
        })
      ).rows[0].count,
    );
    if (count >= 5)
      throw new HttpError(
        429,
        "Você já criou cinco desafios nesta hora. Aguarde ou use uma sala existente.",
      );
    const total = Number(
      (await tx.execute("SELECT COUNT(*) AS count FROM battles")).rows[0].count,
    );
    if (total >= 2000)
      throw new HttpError(
        503,
        "Os desafios estão com alta demanda. A prática individual continua disponível.",
      );
    await tx.execute({
      sql: "INSERT INTO battles(id,hostId,questionIds,state,createdAt) VALUES(?,?,?,?,?)",
      args: [
        id,
        actor,
        JSON.stringify(questions),
        JSON.stringify({ p1: [], p2: [] }),
        new Date().toISOString(),
      ],
    });
  });
  return id;
}
export async function battleView(id: string, actor: string) {
  const row = (
    await (
      await getDb()
    ).execute({ sql: "SELECT * FROM battles WHERE id=?", args: [id] })
  ).rows[0];
  checkRoom(row);
  const role =
    row.hostId === actor ? "p1" : row.guestId === actor ? "p2" : null;
  if (!role) return { id, canJoin: !row.guestId, participant: false };
  const questions = roomQuestions(row.questionIds),
    ids = questions.map((q) => q.id),
    state = JSON.parse(String(row.state)) as State,
    own = state[role],
    other = state[role === "p1" ? "p2" : "p1"];
  const finished =
    state.p1.length === ids.length && state.p2.length === ids.length;
  return {
    id,
    participant: true,
    waiting: !row.guestId,
    role,
    total: ids.length,
    answered: own.length,
    opponentAnswered: other.length,
    myScore: own.reduce((s, r) => s + r.points, 0),
    opponentScore: other.reduce((s, r) => s + r.points, 0),
    finished,
    ownFinished: own.length === ids.length,
    question:
      row.guestId && own.length < ids.length
        ? publicQuestion(questions[own.length])
        : null,
  };
}
export async function joinBattle(id: string, actor: string) {
  return writeTransaction(async (tx) => {
    const row = (
      await tx.execute({ sql: "SELECT * FROM battles WHERE id=?", args: [id] })
    ).rows[0];
    checkRoom(row);
    if (row.hostId === actor || row.guestId === actor) return;
    if (row.guestId)
      throw new HttpError(409, "Esta sala já tem dois participantes.");
    await tx.execute({
      sql: "UPDATE battles SET guestId=? WHERE id=?",
      args: [actor, id],
    });
  });
}
export async function battleAnswer(
  id: string,
  actor: string,
  questionId: string,
  selected: unknown,
) {
  return writeTransaction(async (tx) => {
    const row = (
      await tx.execute({ sql: "SELECT * FROM battles WHERE id=?", args: [id] })
    ).rows[0];
    checkRoom(row);
    const role =
      row.hostId === actor ? "p1" : row.guestId === actor ? "p2" : null;
    if (!role) throw new HttpError(403, "Você não participa deste desafio.");
    if (!row.guestId) throw new HttpError(409, "Aguarde o outro participante.");
    const state = JSON.parse(String(row.state)) as State,
      questions = roomQuestions(row.questionIds),
      ids = questions.map((q) => q.id),
      own = state[role];
    const previous = own.find((r) => r.questionId === questionId);
    if (previous) {
      if (previous.selectedOption !== selected)
        throw new HttpError(409, "Questão já respondida.");
      return previous;
    }
    if (ids[own.length] !== questionId)
      throw new HttpError(409, "Responda a questão atual.");
    const answer = validateAnswer(questions[own.length], selected, 0);
    const result = {
      questionId,
      selectedOption: answer.selectedOption,
      acertou: answer.acertou,
      correta: answer.correta,
      explicacaoIA: answer.explicacaoIA,
      points: answer.acertou ? 10 : 0,
    };
    own.push(result);
    await tx.execute({
      sql: "UPDATE battles SET state=? WHERE id=?",
      args: [JSON.stringify(state), id],
    });
    return result;
  });
}

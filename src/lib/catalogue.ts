import raw from "@/data/approved-questions.json";
import { randomInt, createHash } from "node:crypto";
import { HttpError } from "./http";
import type { PublicQuestion } from "./types";
export interface Question extends PublicQuestion {
  correta: number;
  explicacao: string;
  dificuldade: string | null;
  status: string;
  source: PublicQuestion["source"] & {
    day: number;
    booklet: number;
    application: string;
  };
}
const catalogue: Question[] = raw;
function canonical(value: unknown): unknown {
  return Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.entries(value)
            .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
            .map(([k, v]) => [k, canonical(v)]),
        )
      : value;
}
export function readQuestionSnapshot(input: unknown): Question {
  const q = input as Question;
  if (
    !q ||
    q.status !== "APPROVED" ||
    !Array.isArray(q.alternativas) ||
    q.alternativas.length !== 5 ||
    !Number.isInteger(q.correta) ||
    q.correta < 0 ||
    q.correta > 4
  )
    throw new HttpError(
      503,
      "A versão desta questão precisa ser revisada. Inicie uma nova prática.",
    );
  const { id, version, ...content } = q;
  const hash = createHash("sha256")
    .update(JSON.stringify(canonical(content)))
    .digest("hex");
  if (hash !== version || !id.endsWith(hash.slice(0, 16)))
    throw new HttpError(
      503,
      "A versão desta questão não pôde ser validada. Inicie uma nova prática.",
    );
  return q;
}
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function approvedQuestions(subject?: string | null) {
  return catalogue.filter(
    (q) =>
      q.status === "APPROVED" &&
      (!subject || normalize(q.materia) === normalize(subject)),
  );
}
export function questionById(id: string) {
  const q = catalogue.find((q) => q.id === id && q.status === "APPROVED");
  if (!q) throw new HttpError(404, "Questão indisponível para estudo.");
  return q;
}
export function publicQuestion(q: Question) {
  return {
    id: q.id,
    version: q.version,
    materia: q.materia,
    enunciado: q.enunciado,
    alternativas: q.alternativas,
    source: q.source,
    ...(q.media ? { media: q.media } : {}),
    explanationStatus: q.explanationStatus || "reviewed",
  };
}
export function sampleQuestions(
  subject?: string | null,
  count = 10,
  year?: number,
  excluded: string[] = [],
) {
  const seen = new Set(excluded);
  const qs = approvedQuestions(subject).filter(
    (q) => !year || q.source.year === year,
  );
  for (let i = qs.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [qs[i], qs[j]] = [qs[j], qs[i]];
  }
  const fresh = qs.filter((q) => !seen.has(q.id));
  // Finish the unseen pool before beginning a review round.
  return (fresh.length ? fresh : qs).slice(0, count);
}
export function validateAnswer(q: Question, selected: unknown, tempo: unknown) {
  if (
    !Number.isInteger(selected) ||
    Number(selected) < 0 ||
    Number(selected) >= q.alternativas.length
  )
    throw new HttpError(400, "Escolha uma alternativa válida.");
  if (!Number.isInteger(tempo) || Number(tempo) < 0 || Number(tempo) > 86400)
    throw new HttpError(400, "Tempo de resposta inválido.");
  return {
    selectedOption: Number(selected),
    tempo: Number(tempo),
    acertou: selected === q.correta,
    correta: q.correta,
    explicacaoIA: q.explicacao,
    questionVersion: q.version,
  };
}

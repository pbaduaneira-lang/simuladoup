import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const root = new URL("../", import.meta.url),
  questions = JSON.parse(
    readFileSync(new URL("src/data/approved-questions.json", root), "utf8"),
  ),
  keys = JSON.parse(
    readFileSync(new URL("src/data/official-answer-keys.json", root), "utf8"),
  );
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
const ids = new Set(),
  origins = new Set();
const provenance = JSON.parse(
  readFileSync(new URL("src/data/catalogue-provenance.json", root), "utf8"),
);
const crops = new Map(provenance.crops.map((c) => [c.questionId, c]));
for (const q of questions) {
  const { id, version, ...content } = q;
  if (
    q.status !== "APPROVED" ||
    !Number.isInteger(q.correta) ||
    q.correta < 0 ||
    q.correta > 4 ||
    q.alternativas.length !== 5 ||
    q.alternativas.some((a) => typeof a !== "string" || !a.trim()) ||
    q.enunciado.length < 60
  )
    throw Error(`Estrutura inválida: ${id}`);
  const source = q.source,
    origin = `${source.year}:${source.application}:${source.day}:${source.booklet}:${source.language || "geral"}:${source.number}`;
  if (keys[origin] !== "ABCDE"[q.correta])
    throw Error(`Gabarito não confere: ${origin}`);
  if (
    !source.url.startsWith("https://download.inep.gov.br/") ||
    !source.answerKeyUrl.startsWith("https://download.inep.gov.br/")
  )
    throw Error(`Fonte não reconhecida: ${id}`);
  if (ids.has(id) || origins.has(origin))
    throw Error(`Questão repetida: ${id}`);
  ids.add(id);
  origins.add(origin);
  if (q.media) {
    const crop = crops.get(id);
    if (
      !/^\/questions\/enem\/[a-z0-9-]+\.webp$/.test(q.media.src) ||
      !crop ||
      crop.origin !== origin ||
      crop.labels !== "ABCDE" ||
      crop.imageSha256 !== q.media.sha256 ||
      q.explanationStatus !== "answer-key-only"
    )
      throw Error(`Reprodução sem proveniência: ${id}`);
    const bytes = readFileSync(new URL(`public${q.media.src}`, root));
    if (createHash("sha256").update(bytes).digest("hex") !== q.media.sha256)
      throw Error(`Imagem alterada: ${id}`);
    if (q.media.width < 500 || q.media.height < 100 || !q.media.alt)
      throw Error(`Imagem incompleta: ${id}`);
    const pdf = provenance.sources.find(
      (s) =>
        s.kind === "PV" &&
        s.year === source.year &&
        s.day === source.day &&
        s.booklet === source.booklet,
    );
    if (
      !pdf ||
      pdf.sha256 !== crop.pdfSha256 ||
      source.url !== `${pdf.url}#page=${crop.page}`
    )
      throw Error(`Página de origem não confere: ${id}`);
    if (
      source.year === 2025 &&
      source.day === 1 &&
      source.number >= 6 &&
      source.number <= 10 &&
      (crop.segments?.length !== 2 ||
        crop.segments[0].page !== 6 ||
        crop.segments[1].page !== 7)
    )
      throw Error(`Texto compartilhado ausente: ${id}`);
  }
  const hash = createHash("sha256")
    .update(JSON.stringify(canonical(content)))
    .digest("hex");
  if (hash !== version || !id.endsWith(hash.slice(0, 16)))
    throw Error(`Versão alterada sem nova revisão: ${id}`);
  if (
    /CADERNO\s+\d|RASCUNHO DA REDAÇÃO|ENEM202\d|QUESTÃO\s+\d/.test(
      q.enunciado + " " + q.alternativas.join(" "),
    )
  )
    throw Error(`Resíduo de extração: ${id}`);
}
if (!questions.length) throw Error("Acervo vazio");
console.log(
  `${questions.length} questões: gabaritos, origem, unicidade e versões conferidos.`,
);

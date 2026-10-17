export function parseAnswerKey(text) {
  const result = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(
      /^\s*(\d{1,3})\s+(ANULAD[OA]|[A-E])(?:\s+([A-E]))?\s*$/i,
    );
    if (!match) continue;
    const n = Number(match[1]),
      value = /^ANULAD/i.test(match[2]) ? null : match[2].toUpperCase();
    if (n < 1 || n > 180) throw Error("Número de questão inválido");
    for (const [key, answer] of match[3]
      ? [
          [`${n}:ingles`, value],
          [`${n}:espanhol`, match[3].toUpperCase()],
        ]
      : [[`${n}:geral`, value]]) {
      if (result.has(key) && result.get(key) !== answer)
        throw Error(`Gabaritos conflitantes: ${key}`);
      result.set(key, answer);
    }
  }
  return result;
}
export function requireAnswer(key, number, language = "geral") {
  const id = `${number}:${language}`;
  if (!key.has(id)) throw Error(`Gabarito ausente: ${id}`);
  const answer = key.get(id);
  return answer === null
    ? { status: "ANNULLED", correta: null }
    : { status: "PENDING_REVIEW", correta: "ABCDE".indexOf(answer) };
}

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function cleanAlternativeText(text) {
  if (!text) return "";
  let cleaned = text;

  // 1. Remove rodapés de cadernos do ENEM capturados no fim da alternativa
  cleaned = cleaned.replace(/\s*(?:\d+\s*[–-]?\s*)?(?:LC|CH|CN|MT)?\s*[•·-]?\s*(?:1º|2º)?\s*DIA\s*[•·-]?\s*(?:CADERNO|CA|ERNO)\s*\d*.*$/i, '');
  cleaned = cleaned.replace(/\s*(?:CADERNO|CA|ERNO)\s*\d*\s*[•·-]?\s*(?:AZUL|AMARELO|BRANCO|ROSA|CINZA|VERDE).*$/i, '');
  cleaned = cleaned.replace(/\s*M\d{4}\s+TECNOLOGIAS.*$/i, '');
  cleaned = cleaned.replace(/\s*ZUL\s*\d+.*$/i, '');
  cleaned = cleaned.replace(/\s*RNO\s*\d+.*$/i, '');
  cleaned = cleaned.replace(/\s*Questões de \d+ a \d+.*$/i, '');

  // 2. Remove hífens e traços soltos no final
  cleaned = cleaned.replace(/\s*[–-]$/, '');

  return cleaned.trim();
}

const CRONICA_DE_PROPRIO_PUNHO = `[Texto de Apoio: Crônica "De próprio punho"]
“A escrita e suas tecnologias sofrem interessantes metamorfoses, numa ciranda que vai do simples bilhete aos originais de um livro.

Estranhei muito na primeira vez que escutei a expressão ‘de próprio punho’. Parecia que eu ia bater em alguém. Não era bem o caso. Foi numa situação bancária, dessas bem burocráticas, e eu devia escrever algo bem breve, mas com minhas mãos. Na verdade, o que importava era a autenticidade da minha caligrafia, que à época ainda era mais fluente e firme. Depois dos teclados de computador, ela rateia bastante.

É claro que já escrevi muito mais de próprio punho ou, numa palavra mais bonita, manuscrevi. Mas isso não é um feito individual. Em larga medida, é social. Muita gente sente o mesmo que eu, isto é, escreve bem menos usando as mãos. Sou dessas pessoas privilegiadas que têm várias possibilidades: ainda hoje, são elas que batucam meu teclado de computador ou que tocam suavemente duas ou três telas sensíveis. Mas não expressam mais a minha letra. No lugar, aparecem Times New Roman, Arial, Calibri...

A despeito desse rol de ferramentas, o manuscrito nunca deixou de pintar aqui e ali, muitas vezes como obrigação. Na escola, por exemplo, até hoje ele é soberano. No Enem também. Fico pensando em que espaços e ocasiões ainda uso minha letra. Olhando ao redor, na minha casa, minha letra está em espaços muito delimitados e específicos: bilhetes. Eles estão principalmente na cozinha, em especial na porta da geladeira, a fim de manter a comunicação com meus coabitantes, sempre muito esquecidos.”`;

async function sanitizeDatabase() {
  console.log("Iniciando higienização do acervo de questões...");

  const allQuestions = await prisma.question.findMany();
  console.log(`Total de questões encontradas: ${allQuestions.length}`);

  let cleanedAltsCount = 0;
  let fixedTextsCount = 0;
  let deletedCount = 0;

  for (const q of allQuestions) {
    let alts = [];
    try {
      alts = JSON.parse(q.alternativas);
    } catch (e) {
      console.log(`Deletando questão ${q.id} (JSON inválido)`);
      await prisma.question.delete({ where: { id: q.id } });
      deletedCount++;
      continue;
    }

    // 1. Descartar questões irrecuperáveis que dependem de gráfico/imagem ausente ou com fórmulas destruídas
    const enuncLower = q.enunciado.toLowerCase();
    const isCorruptFormula = alts.some(a => /^e\s+\d+\s+\d+/i.test(a));
    const isMissingChart = (enuncLower.includes("observou o gráfico") || enuncLower.includes("conforme o esquema")) && q.enunciado.length < 200;
    const isTruncatedIncomplete = q.enunciado.endsWith(" embalage") || q.enunciado.endsWith(" RICO") || q.enunciado.endsWith(" l");

    if (isCorruptFormula || isMissingChart || isTruncatedIncomplete) {
      console.log(`Deletando questão problemática: ${q.id} - ${q.enunciado.substring(0, 60)}...`);
      await prisma.question.delete({ where: { id: q.id } });
      deletedCount++;
      continue;
    }

    // 2. Limpar rodapés das alternativas
    let altsChanged = false;
    const cleanedAlts = alts.map(a => {
      const c = cleanAlternativeText(a);
      if (c !== a) altsChanged = true;
      return c;
    });

    // 3. Injetar texto da crônica na Questão 6 de 2025
    let newEnunciado = q.enunciado;
    if (q.enunciado.includes("[ENEM 2025 - Q6]") && !q.enunciado.includes("Estranhei muito")) {
      newEnunciado = `[ENEM 2025 - Q6]\n\n${CRONICA_DE_PROPRIO_PUNHO}\n\nNo que diz respeito ao gênero bilhete, a autora dessa crônica:`;
      fixedTextsCount++;
    }

    // 4. Salvar atualização se houve mudança
    if (altsChanged || newEnunciado !== q.enunciado) {
      await prisma.question.update({
        where: { id: q.id },
        data: {
          alternativas: JSON.stringify(cleanedAlts),
          enunciado: newEnunciado,
        }
      });
      if (altsChanged) cleanedAltsCount++;
    }
  }

  console.log(`\n✅ Higienização concluída com sucesso!`);
  console.log(`- Questões com alternativas limpas: ${cleanedAltsCount}`);
  console.log(`- Questões com texto motivador restaurado: ${fixedTextsCount}`);
  console.log(`- Questões irrecuperáveis deletadas: ${deletedCount}`);

  // Sincronizar os simulados com as novas questões do banco
  console.log("\nAtualizando tabelas de Simulados...");
  const updatedQuestions = await prisma.question.findMany();
  
  const q2025 = updatedQuestions.filter(q => q.enunciado.includes('ENEM 2025'));
  if (q2025.length > 0) {
    await prisma.simulado.upsert({
      where: { id: "enem-2025-oficial" },
      update: { questions: JSON.stringify(q2025) },
      create: { id: "enem-2025-oficial", userId: "b6b43411-fe62-4966-ac48-1cfd906d2e85", type: "GERAL", questions: JSON.stringify(q2025) }
    });
  }

  const q2023 = updatedQuestions.filter(q => q.enunciado.includes('ENEM 2023'));
  if (q2023.length > 0) {
    await prisma.simulado.upsert({
      where: { id: "enem-2023-oficial" },
      update: { questions: JSON.stringify(q2023) },
      create: { id: "enem-2023-oficial", userId: "b6b43411-fe62-4966-ac48-1cfd906d2e85", type: "GERAL", questions: JSON.stringify(q2023) }
    });
  }

  const q2024 = updatedQuestions.filter(q => q.enunciado.includes('ENEM 2024'));
  if (q2024.length > 0) {
    await prisma.simulado.upsert({
      where: { id: "enem-2024-oficial" },
      update: { questions: JSON.stringify(q2024) },
      create: { id: "enem-2024-oficial", userId: "b6b43411-fe62-4966-ac48-1cfd906d2e85", type: "GERAL", questions: JSON.stringify(q2024) }
    });
  }

  await prisma.simulado.upsert({
    where: { id: "enem-mix-completo" },
    update: { questions: JSON.stringify(updatedQuestions) },
    create: { id: "enem-mix-completo", userId: "b6b43411-fe62-4966-ac48-1cfd906d2e85", type: "GERAL", questions: JSON.stringify(updatedQuestions) }
  });

  console.log("Simulados atualizados com sucesso!");
}

sanitizeDatabase().finally(() => prisma.$disconnect());

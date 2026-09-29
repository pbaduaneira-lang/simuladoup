const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando inserção das questões do ENEM 2025 no banco de dados...");
  
  const rawData = fs.readFileSync(path.join(__dirname, 'enem_2025_questoes.json'), 'utf-8');
  const questoes = JSON.parse(rawData);

  console.log(`Total de questões para inserir: ${questoes.length}`);

  const createdQuestions = [];

  for (const q of questoes) {
    try {
      const created = await prisma.question.create({
        data: {
          materia: q.materia,
          dificuldade: q.dificuldade,
          enunciado: q.enunciado,
          alternativas: JSON.stringify(q.alternativas),
          correta: q.correta,
          explicacaoIA: q.explicacaoIA
        }
      });
      createdQuestions.push(created);
    } catch (e) {
      console.error(`Erro ao inserir questão ${q.numeroEnem}:`, e.message);
    }
  }

  console.log(`Inseridas com sucesso: ${createdQuestions.length} questões no banco.`);

  // Criar um Simulado dedicado com as questões do ENEM 2025
  const user = await prisma.user.findFirst();
  const userId = user ? user.id : "b6b43411-fe62-4966-ac48-1cfd906d2e85";

  // Formata as questões do simulado com alternativas parseadas para o frontend
  const simuladoQuestions = createdQuestions.slice(0, 20).map(q => ({
    ...q,
    alternativas: JSON.parse(q.alternativas)
  }));

  const simulado = await prisma.simulado.create({
    data: {
      id: "enem-2025-oficial",
      userId: userId,
      type: "ENEM_2025",
      questions: JSON.stringify(simuladoQuestions)
    }
  });

  console.log(`Simulado criado com sucesso! ID: ${simulado.id}`);
  console.log(`URL do Simulado: http://localhost:3005/app/feed?simulado=${simulado.id}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

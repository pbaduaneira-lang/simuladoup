const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if(!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        nomeCompleto: 'Usuário Teste'
      }
    });
  }
  console.log(user.id);
}

main().finally(() => prisma.$disconnect());

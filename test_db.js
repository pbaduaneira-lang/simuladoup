const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.question.count().then(console.log).finally(() => prisma.$disconnect());

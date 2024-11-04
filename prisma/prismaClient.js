const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

console.log("Prisma Client Instanciado");

module.exports = prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

console.log("Prisma CLient Instanciado");

module.exports = prisma
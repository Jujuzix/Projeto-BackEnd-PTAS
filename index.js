const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const app = express();

//rotas
const authRoutes = require("./route/authRoutes");
app.use("/auth", authRoutes); 

app.listen(8000);

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");

const app = express();
app.use(express.json());

app.use(express.urlencoded({extended: true}));

//rotas
const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes); 

app.listen(8000);

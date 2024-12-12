const cors = require("cors")
const prisma = require("./prisma/prismaClient");

const express = require("express");

const AuthController = require ("./controllers/AuthController")

const app = express();
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//rotas
const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes);
const mesaRoutes = require("./routes/mesaRoute");
app.use("/mesas", mesaRoutes);

app.use("/perfil" , AuthController.verficarAutenticacao, perfilRoutes);

app.get("/privado", AuthController.verficarAutenticacao, (req, res) => {
    res.json({
        msg: "Voce entrou em area privada"
    });
});

app.listen(8000);

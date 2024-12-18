const cors = require("cors")
const prisma = require("./prisma/prismaClient");

const express = require("express");

const AuthController = require ("./controllers/AuthController")

const app = express();
app.use(cors())
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//rotas
const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes);
const mesaRoutes = require("./routes/mesaRoute");
app.use("/mesas", AuthController.verficarAutenticacao, mesaRoutes);
const profileRoutes = require("./routes/profileRoutes");
app.use("/perfil" , AuthController.verficarAutenticacao, profileRoutes);

app.get("/privado", AuthController.verficarAutenticacao, (req, res) => {
    res.json({
        msg: "Voce entrou em area privada"
    });
});

app.listen(8000);

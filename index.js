const cors = require("cors")
const prisma = require("./prisma/prismaClient");

const express = require("express");

const app = express();
app.use(cors({
    origin:"http://localhost:3000"
}))
app.use(express.json());

app.use(express.urlencoded({extended: true}));

//rotas
const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes); 
const mesaRoutes = require("./routes/mesaRoute");
app.use("/mesas", mesaRoutes); 

app.listen(8000);

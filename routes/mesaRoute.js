const prisma = require("../prisma/prismaClient");
const router = require("express").Router();

const MesaController = require("../controllers/MesaController");

router.post("/cadastrar", MesaController.cadastrar);
router.post("/reservar", MesaController.reservar);
router.get("/", MesaController.buscarTodas)

module.exports = router;

const prisma = require("../prisma/prismaClient");
const router = require("express").Router();

const MesaController = require("../controllers/MesaController");

router.post("/mesa", MesaController.mesa);
router.post("/reservar", MesaController.reservar);

module.exports = router;

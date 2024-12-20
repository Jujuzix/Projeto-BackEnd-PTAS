const prisma = require("../prisma/prismaClient");
const router = require("express").Router();

const AuthController = require("../controllers/AuthController");

router.post("/login", AuthController.login);
router.post("/cadastro", AuthController.cadastro);


module.exports = router;

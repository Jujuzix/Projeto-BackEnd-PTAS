const express = require('express')
const router = express.Router()

const ProfileController = require('../controllers/ProfileController')

router.get("/visualizar", ProfileController.visualizar);
router.post("/atualizar", ProfileController.atualizar);

module.exports = router;
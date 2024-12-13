const prisma = require("../prisma/prismaClient")

class ProfileController {
    static async visualizar(req, res) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.usuarioId },
            select: {
                nome: true,
                email: true,
                tipo: true,
            }
        })
        if (!usuario) {
            return res.status(422).json({ erro: true, mensagem: "Usuário não encontrado." })
        }
    }
    static async atualizar(req, res) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.usuarioId },
            select: {
                nome: true,
                email: true,
                senha: true,
                reservas: true,
            }
        })
        if (!usuario) {
            return res.status(422).json({ erro: true, mensagem: "Usuário não encontrado." })
        }
    }
}


module.exports = ProfileController;
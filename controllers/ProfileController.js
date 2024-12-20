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
        }else{
            return res.status(200).json({usuario})
        }
    }
    static async atualizar(req, res) {
        const nome = req.body.nome
        const email = req.body.email
             prisma.usuario.update({
                where: { id: req.usuarioId },
                data:{
                    nome: nome,
                    email: email
                }
            }).then(()=>{
                return res.status(200).json({ erro: false, mensagem: "Usuário Atualizado." })
            }).catch((error) =>{
                return res.status(422).json({ erro: true, mensagem: "Erro ao atualizar o usuario" })
            })
    }
}

module.exports = ProfileController;
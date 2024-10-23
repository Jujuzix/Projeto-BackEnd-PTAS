const { PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();


class AuthController {
    static async cadastro(req, res) {
        const {nome, email, password, tipo} = req.body;

        if(!nome || nome.length < 6){
            return res.json({
                erro: true,
                mensagem:"O nome deve ter pelomenos 6 caracteres.",
            });
        }

        return res.json({
            erro: false,
            mensagem:"Usuário Cadastrado.",
            token:"jasjdskadklasjdksjkladsklldkl",
        });

    }

    static async login(req, res) {
        res.json({
            email: req.body.email,
            senha: req.body.password,
        });
    }

    static async loginForm(req, res){
        res.send(
            "<form action='/auth/login' method='post'><input type='email' name='email'><input type='password' name='password'><input type='submit' value='Entrar'></form>"
        );
    }
}

module.exports = AuthController
const prisma = require("../prisma/prismaClient");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  static async cadastro(req, res) {
    const { nome, email, password } = req.body;

    if (!nome || nome.length < 6)
      return res.status(422).json({ erro: true, mensagem: "O nome deve ter pelo menos 6 caracteres." });
    if (!email || email.length < 10)
      return res.status(422).json({ erro: true, mensagem: "O email deve ter pelo menos 10 caracteres." });
    if (!password || password.length < 8)
      return res.status(422).json({ erro: true, mensagem: "A senha deve ter pelo menos 8 caracteres." });

    const existe = await prisma.usuario.count({ where: { email } });
    if (existe)
      return res.status(422).json({ erro: true, mensagem: "Já existe um usuário com este e-mail" });

    const hashPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync(8));
    try {
      await prisma.usuario.create({
        data: { nome, email, password: hashPassword, tipo: "cliente" }
      });
      return res.status(201).json({ erro: false, mensagem: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ erro: true, mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario)
      return res.status(422).json({ erro: true, mensagem: "Usuário não encontrado." });

    if (!bcryptjs.compareSync(password, usuario.password))
      return res.status(422).json({ erro: true, mensagem: "Senha incorreta." });

    const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ erro: false, mensagem: "Autenticação realizada com sucesso!", token });
  }

  static async verficarAutenticacao(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log("token gerado" + authHeader)
    const token = authHeader// && authHeader.split("")[1];
    if (!token) {
      return res.status(422).json({ messsage: "Token não encontrado" })
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(401).json({ msg: "Token invalido" })
      }

      req.usuarioId = payload.id;
      next()
    });
  }
}
module.exports = AuthController;
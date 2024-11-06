const prisma = require("../prisma/prismaClient");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  // Método para cadastro de novos usuários
  static async cadastro(req, res) {
    const { nome, email, password } = req.body;

    // Validações de entrada
    if (!nome || nome.length < 6) 
      return res.status(422).json({ erro: true, mensagem: "O nome deve ter pelo menos 6 caracteres." });
    if (!email || email.length < 10) 
      return res.status(422).json({ erro: true, mensagem: "O email deve ter pelo menos 10 caracteres." });
    if (!password || password.length < 8) 
      return res.status(422).json({ erro: true, mensagem: "A senha deve ter pelo menos 8 caracteres." });

    // Verifica se o usuário já existe
    const existe = await prisma.usuario.count({ where: { email } });
    if (existe) 
      return res.status(422).json({ erro: true, mensagem: "Já existe um usuário com este e-mail" });

    // Cria usuário com hash de senha
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

  // Método para login de usuários
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

  // Método para cadastro de novos administradores
  static async cadastroAdm(req, res) {
    const { nome, email, password } = req.body;

    if (!nome || nome.length < 6) 
      return res.status(422).json({ erro: true, mensagem: "O nome deve ter pelo menos 6 caracteres." });
    if (!email || email.length < 10) 
      return res.status(422).json({ erro: true, mensagem: "O email deve ter pelo menos 10 caracteres." });
    if (!password || password.length < 8) 
      return res.status(422).json({ erro: true, mensagem: "A senha deve ter pelo menos 8 caracteres." });

    const existe = await prisma.usuarioAdm.count({ where: { email } });
    if (existe) 
      return res.status(422).json({ erro: true, mensagem: "Já existe um usuário com este e-mail" });

    const hashPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync(8));
    try {
      await prisma.usuarioAdm.create({
        data: { nome, email, password: hashPassword, tipo: "Adm" }
      });
      return res.status(201).json({ erro: false, mensagem: "Administrador cadastrado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ erro: true, mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error });
    }
  }

  // Método para login de administradores
  static async loginAdm(req, res) {
    const { email, password } = req.body;

    const usuarioAdm = await prisma.usuarioAdm.findUnique({ where: { email } });
    if (!usuarioAdm) 
      return res.status(422).json({ erro: true, mensagem: "Administrador não encontrado." });

    if (!bcryptjs.compareSync(password, usuarioAdm.password)) 
      return res.status(422).json({ erro: true, mensagem: "Senha incorreta." });

    const token = jwt.sign({ id: usuarioAdm.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ erro: false, mensagem: "Autenticação realizada com sucesso!", token });
  }
}

module.exports = AuthController;

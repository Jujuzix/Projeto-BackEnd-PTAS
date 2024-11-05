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

  // Método para cadastro de mesas
  static async cadastroMesa(req, res) {
    const { codigo, n_pessoas } = req.body;

    if (!codigo) 
      return res.status(422).json({ erro: true, mensagem: "Codigo já existente." });
    if (!n_pessoas || isNaN(n_pessoas) || n_pessoas <= 0) 
      return res.status(422).json({ erro: true, mensagem: "O número de pessoas deve ser um valor positivo." });

    const existe = await prisma.CriaMesa.count({ where: { codigo } });
    if (existe) 
      return res.status(422).json({ erro: true, mensagem: "Já existe uma mesa com este código." });

    try {
      const criaMesa = await prisma.criaMesa.create({ data: { codigo, n_pessoas, tipo: "Mesa" } });
      const token = jwt.sign({ id: criaMesa.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      return res.status(201).json({ erro: false, mensagem: "Mesa cadastrada com sucesso!", token });
    } catch (error) {
      return res.status(500).json({ erro: true, mensagem: "Ocorreu um erro ao efetuar sua reserva, tente novamente mais tarde! " + error.message });
    }
  }

  // Método para cadastro de reservas
  static async cadastroReservas(req, res) {
    const { nome_reserva, data_reserva, n_pessoas } = req.body;

    if (!nome_reserva || nome_reserva.length < 3) 
      return res.status(422).json({ erro: true, mensagem: "O nome da reserva deve ter pelo menos 3 caracteres." });
    if (!n_pessoas || isNaN(n_pessoas) || n_pessoas <= 0) 
      return res.status(422).json({ erro: true, mensagem: "O número de pessoas deve ser um valor positivo." });

    const dataReserva = new Date(data_reserva);
    if (isNaN(dataReserva.getTime())) 
      return res.status(422).json({ erro: true, mensagem: "A data da reserva deve ser uma data válida no formato ISO." });

    const existe = await prisma.reservaMesas.count({ where: { nome_reserva } });
    if (existe) 
      return res.status(422).json({ erro: true, mensagem: "Já existe uma reserva com este nome." });

    try {
      await prisma.reservaMesas.create({ data: { nome_reserva, data_reserva: dataReserva, n_pessoas, tipo: "Reserva" } });
      return res.status(201).json({ erro: false, mensagem: "Reserva cadastrada com sucesso!" });
    } catch (error) {
      return res.status(500).json({ erro: true, mensagem: "Ocorreu um erro ao efetuar sua reserva, tente novamente mais tarde! " + error.message });
    }
  }
}

module.exports = AuthController;

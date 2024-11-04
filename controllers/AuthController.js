const prisma = require("../prisma/prismaClient");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  // Método estático para cadastro de novos usuários
  static async cadastro(req, res) {
    const { nome, email, password } = req.body;

    // Validação do nome
    if (!nome || nome.length < 6) {
      return res.status(422).json({
        erro: true,
        mensagem: "O nome deve ter pelo menos 6 caracteres.",
      });
    }

    // Validação do email
    if (!email || email.length < 10) {
      return res.status(422).json({
        erro: true,
        mensagem: "O email deve ter pelo menos 10 caracteres.",
      });
    }

    // Validação da senha
    if (!password || password.length < 8) {
      return res.status(422).json({
        erro: true,
        mensagem: "A senha deve ter pelo menos 8 caracteres.",
      });
    }

    // Verifica se já existe um usuário com o mesmo e-mail
    const existe = await prisma.usuario.count({
      where: { email: email },
    });

    if (existe != 0) {
      return res.status(422).json({
        erro: true,
        mensagem: "Já existe um usuário com este e-mail",
      });
    }

    // Gera um salt e hash da senha
    const salt = bcryptjs.genSaltSync(8);
    const hashPassword = bcryptjs.hashSync(password, salt);

    try {
      // Cria um novo usuário no banco de dados
      const usuario = await prisma.usuario.create({
        data: {
          nome: nome,
          email: email,
          password: hashPassword,
          tipo: "cliente",
        },
      });

      // Resposta de sucesso
      return res.status(201).json({
        erro: false,
        mensagem: "Usuário cadastrado com sucesso!",
      });
    } catch (error) {
      // Resposta em caso de erro
      return res.status(500).json({
        erro: true,
        mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error,
      });
    }
  }

  // Método estático para login de usuários
  static async login(req, res) {
    const { email, password } = req.body;

    // Busca o usuário pelo e-mail
    const usuario = await prisma.usuario.findUnique({
      where: { email: email },
    });

    // Verifica se o usuário existe
    if (!usuario) {
      return res.status(422).json({
        erro: true,
        mensagem: "Usuário não encontrado.",
      });
    }

    // Verifica a senha usando bcryptjs
    const senhaCorreta = bcryptjs.compareSync(password, usuario.password);

    if (!senhaCorreta) {
      return res.status(422).json({
        erro: true,
        mensagem: "Senha incorreta.",
      });
    }

    // Gera um token JWT para o usuário
    const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Resposta de sucesso com o token
    res.status(200).json({
      erro: false,
      mensagem: "Autenticação realizada com sucesso!",
      token: token,
    });
  }

  // Método estático para cadastro de novos administradores
  static async cadastroAdm(req, res) {
    const { nome, email, password } = req.body;

    // Validação do nome
    if (!nome || nome.length < 6) {
      return res.status(422).json({
        erro: true,
        mensagem: "O nome deve ter pelo menos 6 caracteres.",
      });
    }

    // Validação do email
    if (!email || email.length < 10) {
      return res.status(422).json({
        erro: true,
        mensagem: "O email deve ter pelo menos 10 caracteres.",
      });
    }

    // Validação da senha
    if (!password || password.length < 8) {
      return res.status(422).json({
        erro: true,
        mensagem: "A senha deve ter pelo menos 8 caracteres.",
      });
    }

    // Verifica se já existe um usuário com o mesmo e-mail
    const existe = await prisma.usuarioAdm.count({
      where: { email: email },
    });

    if (existe != 0) {
      return res.status(422).json({
        erro: true,
        mensagem: "Já existe um usuário com este e-mail",
      });
    }

    // Gera um salt e hash da senha
    const salt = bcryptjs.genSaltSync(8);
    const hashPassword = bcryptjs.hashSync(password, salt);

    try {
      // Cria um novo administrador no banco de dados
      const usuarioAdm = await prisma.usuarioAdm.create({
        data: {
          nome: nome,
          email: email,
          password: hashPassword,
          tipo: "Adm",
        },
      });

      // Resposta de sucesso
      return res.status(201).json({
        erro: false,
        mensagem: "Administrador cadastrado com sucesso!",
      });
    } catch (error) {
      // Resposta em caso de erro
      return res.status(500).json({
        erro: true,
        mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error,
      });
    }
  }

  // Método estático para login de administradores
  static async loginAdm(req, res) {
    const { email, password } = req.body;

    // Busca o administrador pelo e-mail
    const usuarioAdm = await prisma.usuarioAdm.findUnique({
      where: { email: email },
    });

    // Verifica se o administrador existe
    if (!usuarioAdm) {
      return res.status(422).json({
        erro: true,
        mensagem: "Administrador não encontrado.",
      });
    }

    // Verifica a senha usando bcryptjs
    const senhaCorreta = bcryptjs.compareSync(password, usuarioAdm.password);

    if (!senhaCorreta) {
      return res.status(422).json({
        erro: true,
        mensagem: "Senha incorreta.",
      });
    }

    // Gera um token JWT para o administrador
    const token = jwt.sign({ id: usuarioAdm.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Resposta de sucesso com o token
    res.status(200).json({
      erro: false,
      mensagem: "Autenticação realizada com sucesso!",
      token: token,
    });
  }

  static async cadastroReservas(req, res) {
    const { nome_reserva, data_reserva, n_pessoas } = req.body;
  
    // Validação do nome_reserva
    if (!nome_reserva || nome_reserva.length < 3) {
      return res.status(422).json({
        erro: true,
        mensagem: "O nome da reserva deve ter pelo menos 3 caracteres.",
      });
    }
  
    // Validação de n_pessoas
    if (!n_pessoas || isNaN(n_pessoas) || n_pessoas <= 0) {
      return res.status(422).json({
        erro: true,
        mensagem: "O número de pessoas deve ser um valor positivo.",
      });
    }
  
    // Verifica se a data_reserva é válida
    const dataReserva = new Date(data_reserva);
    if (isNaN(dataReserva.getTime())) {
      return res.status(422).json({
        erro: true,
        mensagem: "A data da reserva deve ser uma data válida no formato ISO.",
      });
    }
  
    // Verifica se já existe uma reserva com o mesmo nome_reserva
    const existe = await prisma.reservaMesas.count({
      where: { nome_reserva: nome_reserva },
    });
  
    if (existe !== 0) {
      return res.status(422).json({
        erro: true,
        mensagem: "Já existe uma reserva com este nome.",
      });
    }
  
    try {
      // Cria uma nova reserva no banco de dados
      const reservaMesas = await prisma.reservaMesas.create({
        data: {
          nome_reserva: nome_reserva,
          data_reserva: dataReserva, // Usa o objeto Date convertido
          n_pessoas: n_pessoas,
          tipo: "Reserva",
        },
      });
  
      // Resposta de sucesso
      return res.status(201).json({
        erro: false,
        mensagem: "Reserva cadastrada com sucesso!",
      });
    } catch (error) {
      // Resposta em caso de erro
      return res.status(500).json({
        erro: true,
        mensagem: "Ocorreu um erro ao efetuar sua reserva, tente novamente mais tarde! " + error.message,
      });
    }
  }
  
}


module.exports = AuthController; // Exporta o controlador para ser utilizado em outras partes da aplicação.

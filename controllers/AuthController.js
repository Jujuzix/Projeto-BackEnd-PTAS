const prisma = require("../prisma/prismaClient");
const bcryptjs = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 

  // Método estático para cadastro de novos usuários

class AuthController {
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
        mensagem: "Usuario cadastrado com sucesso!",
      });
    } catch (error) {
      // Resposta em caso de erro
      return res.status(500).json({
        erro: true,
        mensagem: "Ocorreu um erro, tente novamente mais tarde!" + error,
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

    // Resposta de sucesso com o token (substituir token de exemplo por token gerado)
    res.status(200).json({
      erro: false,
      mensagem: "Autenticação realizada com sucesso!",
      token: token,
    });
  }
}

module.exports = AuthController; // Exporta o controlador para ser utilizado em outras partes da aplicação.
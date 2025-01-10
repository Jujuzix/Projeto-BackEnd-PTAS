const prisma = require("../prisma/prismaClient");
const jwt = require("jsonwebtoken");

class MesaController {
  static async cadastrar(req, res) {
    const { n_mesa, n_pessoas } = req.body;
    console.log("Body recebido:", req.body);

    if (!n_mesa) {
      return res
        .status(422)
        .json({ erro: true, mensagem: "O código da mesa é obrigatório." });
    }

    if (!n_pessoas || isNaN(n_pessoas) || n_pessoas <= 0) {
      return res
        .status(422)
        .json({
          erro: true,
          mensagem: `O número de pessoas deve ser um valor positivo. Valor recebido: ${n_pessoas}`,
        });
    }

    const existe = await prisma.mesa.count({ where: { n_mesa } });
    if (existe) {
      return res
        .status(422)
        .json({ erro: true, mensagem: "Já existe uma mesa com este código." });
    }

    try {
      const mesa = await prisma.mesa.create({
        data: { n_mesa, n_pessoas, tipo: "Mesa" },
      });

      const token = jwt.sign({ id: mesa.id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      return res
        .status(201)
        .json({ erro: false, mensagem: "Mesa cadastrada com sucesso!", token });
    } catch (error) {
      return res
        .status(500)
        .json({
          erro: true,
          mensagem: "Ocorreu um erro ao efetuar seu cadastro. " + error.message,
        });
    }
  }

  static async buscarTodas(req, res) {
    const mesas = await prisma.mesa.findMany();
    return res.json({ mesas });
  }

  static async reservar(req, res) {
    console.log("Dados recebidos:", req.body);

    const { n_mesa, data_reserva, n_pessoas, n_pessoas_sentando } = req.body;
    console.log("Dados extraídos:", {
      n_mesa,
      data_reserva,
      n_pessoas,
      n_pessoas_sentando,
    });

    if (!n_mesa || isNaN(n_mesa)) {
      return res
        .status(422)
        .json({ erro: true, mensagem: "O número da mesa é obrigatório." });
    }

    const dataReserva = new Date(data_reserva);
    dataReserva.setHours(0, 0, 0, 0);

    if (dataReserva < new Date()) {
      return res
        .status(422)
        .json({
          erro: true,
          mensagem: "A data da reserva deve ser válida e no futuro.",
        });
    }

    try {
      const mesa = await prisma.mesa.findUnique({ where: { n_mesa } });
      if (!mesa) {
        return res
          .status(404)
          .json({ erro: true, mensagem: "Mesa não encontrada." });
      }

      if (n_pessoas > mesa.n_pessoas) {
        return res
          .status(422)
          .json({
            erro: true,
            mensagem: `O número de pessoas excede a capacidade da mesa (${mesa.n_pessoas}).`,
          });
      }

      const reservaExistente = await prisma.reserva.findFirst({
        where: { n_mesa, data_reserva: dataReserva },
      });

      if (reservaExistente) {
        return res
          .status(422)
          .json({
            erro: true,
            mensagem: "A mesa já está reservada nesta data.",
          });
      }

      await prisma.reserva.create({
        data: {
          n_mesa,
          data_reserva: dataReserva,
          n_pessoas,
          usuario_id: req.usuarioId,
          n_pessoas_sentando, // Agora está definido corretamente
          status: true,
        },
      });

      return res
        .status(201)
        .json({ erro: false, mensagem: "Reserva realizada com sucesso!" });
    } catch (error) {
      console.error("Erro no servidor:", error);
      return res
        .status(500)
        .json({ erro: true, mensagem: "Erro interno ao processar a reserva." });
    }
  }
}

module.exports = MesaController;

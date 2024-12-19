const prisma = require("../prisma/prismaClient");
const jwt = require("jsonwebtoken");

class MesaController {
  static async cadastrar(req, res) {
    const { n_mesa, n_pessoas } = req.body;
    console.log(req.body)

    if (!n_mesa) {
      return res.status(422).json({ erro: true, mensagem: "O código da mesa é obrigatório." });
    }

    if (!n_pessoas || isNaN(n_pessoas) || n_pessoas <= 0) {
      return res.status(422).json({ erro: true, mensagem: `O número de pessoas deve ser um valor positivo. Valor recebido: ${n_pessoas}` });
    }

    const existe = await prisma.mesa.count({ where: { n_mesa } });
    if (existe) {
      return res.status(422).json({ erro: true, mensagem: "Já existe uma mesa com este código." });
    }

    try {
      const mesa = await prisma.mesa.create({ data: { n_mesa, n_pessoas, tipo: "Mesa" } });

      const token = jwt.sign({ id: mesa.id }, process.env.SECRET_KEY, { expiresIn: "1h" });

      return res.status(201).json({ erro: false, mensagem: "Mesa cadastrada com sucesso!", token });
    } catch (error) {
      return res.status(500).json({ erro: true, mensagem: "Ocorreu um erro ao efetuar seu cadastro. " + error.message });
    }
  }

  static async buscarTodas(req, res) {
    const mesas = await prisma.mesa.findMany();
    return res.json({ mesas });
  }

  static async reservar(req, res) {
console.log(req.body)
    const { n_mesa, data_reserva, n_pessoas } = req.body;

    if (!n_mesa) {
      return res.status(422).json({ erro: true, mensagem: "O número da mesa é obrigatório." });
    }

    if (!n_pessoas || isNaN(n_pessoas) || n_pessoas <= 0) {
      return res.status(422).json({ erro: true, mensagem: `O número de pessoas deve ser um valor positivo. Valor recebido: ${n_pessoas}` });
    }

    const dataReserva = new Date(data_reserva);
    if (isNaN(dataReserva.getTime())) {
      return res.status(422).json({ erro: true, mensagem: "A data da reserva deve ser uma data válida." });
    }

    try {
      const existe = await prisma.reserva.findFirst({
        where: {
          data_reserva: dataReserva
        },
      });

      if (existe) {
        return res.status(422).json({ erro: true, mensagem: "A mesa selecionada já está ocupada nesta data." });
      }

      await prisma.reserva.create({
        data: { 
          n_mesa, 
          data_reserva: dataReserva, 
          n_pessoas, 
          usuario_id: req.usuarioId,
          status: true
        },
      });

      return res.status(201).json({ erro: false, mensagem: "Reserva cadastrada com sucesso!" });
    } catch (error) {
      return res.status(500).json({ erro: true, mensagem: "Ocorreu um erro ao efetuar sua reserva. " + error.message });
    }
  }
}

module.exports = MesaController;
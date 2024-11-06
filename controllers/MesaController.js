const prisma = require("../prisma/prismaClient");
const jwt = require("jsonwebtoken");

class MesaController {
  // Método para cadastro de mesas
  static async mesa(req, res) {
    const { codigo, n_pessoas } = req.body;

    if (!codigo) 
      return res.status(422).json({ erro: true, mensagem: "O código é obrigatório." });
    if (!n_pessoas || isNaN(n_pessoas) || n_pessoas <= 0) 
      return res.status(422).json({ erro: true, mensagem: "O número de pessoas deve ser um valor positivo." });

    const existe = await prisma.mesa.count({ where: { codigo } });
    if (existe) 
      return res.status(422).json({ erro: true, mensagem: "Já existe uma mesa com este código." });

    try {
      const mesa = await prisma.mesa.create({ data: { codigo, n_pessoas, tipo: "Mesa" } });
      const token = jwt.sign({ id: mesa.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      return res.status(201).json({ erro: false, mensagem: "Mesa cadastrada com sucesso!", token });
    } catch (error) {
      return res.status(500).json({ erro: true, mensagem: "Ocorreu um erro ao efetuar sua reserva, tente novamente mais tarde! " + error.message });
    }
  }

  // Método para cadastro de reservas
  static async reservar(req, res) {
    const { nome_reserva, data_reserva, n_pessoas } = req.body;

    if (!nome_reserva || nome_reserva.length < 3) 
      return res.status(422).json({ erro: true, mensagem: "O nome da reserva deve ter pelo menos 3 caracteres." });
    if (!n_pessoas || isNaN(n_pessoas) || n_pessoas <= 0) 
      return res.status(422).json({ erro: true, mensagem: "O número de pessoas deve ser um valor positivo." });

    const dataReserva = new Date(data_reserva);
    if (!(dataReserva instanceof Date) || isNaN(dataReserva.getTime())) 
      return res.status(422).json({ erro: true, mensagem: "A data da reserva deve ser uma data válida." });

    try {
      const existe = await prisma.reserva.findFirst({
        where: {
          nome_reserva,
          data_reserva: dataReserva,
        }
      });

      if (existe) 
        return res.status(422).json({ erro: true, mensagem: "Já existe uma reserva com este nome para essa data." });

      await prisma.reserva.create({ data: { nome_reserva, data_reserva: dataReserva, n_pessoas, tipo: "Reserva" } });
      return res.status(201).json({ erro: false, mensagem: "Reserva cadastrada com sucesso!" });
    } catch (error) {
      return res.status(500).json({ erro: true, mensagem: "Ocorreu um erro ao efetuar sua reserva, tente novamente mais tarde! " + error.message });
    }
  }
}

module.exports = MesaController;

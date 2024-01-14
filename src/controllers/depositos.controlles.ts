import { Request, Response } from "express";
import { prisma } from "../database/database";
import { validarCaja } from "../schemas/caja.schema";
import { validarDepositoCaja } from "../schemas/deposito.schema";

export const obtenerDepositosCaja = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;
  try {
    const depositos = await prisma.deposito.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { id: "desc" },
      include: {
        cierreCaja: true,
        caja: true,
      },
    });

    if (depositos) {
      return res.status(200).json({
        ok: true,
        msj: "",
        depositos,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "Deposito no encontrado",
      depositos: [],
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};

export const crearDeposito = async (req: Request, res: Response) => {
  try {
    const data = validarDepositoCaja(req.body);
    if (!data.success) {
      return res
        .status(422)
        .json({ ok: false, msj: JSON.parse(data.error.message) });
    }

    const { idCaja, montoDeposito, idCierreCaja } = data.data;

    const existeCaja = await prisma.caja.findFirst({
      where: { id: idCaja },
      include: { deposito: true },
    });

    if (!existeCaja) {
      return res.status(400).json({
        ok: false,
        msj: `El identificador de la caja proporcionado no se encuentra en la base de datos o no existe.`,
      });
    }
    if (existeCaja.estado) {
      return res.status(400).json({
        ok: false,
        msj: `Para realizar un depósito, es necesario cerrar la caja previamente abierta; es imperativo completar el cierre de caja antes de proceder con el depósito.`,
      });
    }
    if (existeCaja.deposito) {
      return res.status(400).json({
        ok: false,
        msj: `La caja seleccionada ya tiene un depósito registrado.`,
      });
    }
    const existeCierre = await prisma.cierreCaja.findFirst({
      where: { id: idCierreCaja },
    });

    if (!existeCierre) {
      return res.status(400).json({
        ok: false,
        msj: `El identificador del cierre de caja proporcionado no se encuentra en la base de datos o no existe.`,
      });
    }
    if (existeCierre.idCaja !== existeCaja.id) {
      return res.status(404).json({
        ok: false,
        msj: `El identificador del cierre de caja no coincide con la caja que fue cerrada anteriormente.`,
      });
    }
    const montoActualCaja = existeCaja.montoActual;
    const diferenciaCierreCaja = existeCierre.diferencia;
    const restanteCaja = montoActualCaja - montoDeposito - diferenciaCierreCaja;

    if (montoDeposito > existeCierre.montoCierre) {
      return res.status(400).json({
        ok: false,
        msj: `No es posible efectuar un depósito con un valor superior al monto de cierre de caja. Por favor, verifica la cantidad correspondiente al cierre antes de proceder.`,
        montoActualCaja,
        diferenciaCierreCaja,
        restanteCaja,
      });
    }

    const deposito = await prisma.deposito.create({
      data: { idCaja, idCierreCaja, montoDeposito, restanteCaja },
      include: { cierreCaja: true, caja: true },
    });

    return res.status(201).json({
      ok: true,
      msj: `El depósito ha sido registrado con éxito.`,
      deposito,
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};

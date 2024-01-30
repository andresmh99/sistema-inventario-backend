import { Request, Response } from "express";
import { prisma } from "../database/database";
import { validarGasto } from "../schemas/gastos.schema";

export const obtenerGastos = async (req: Request, res: Response) => {
  try {
    const gastos = await prisma.gasto.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (gastos.length > 0) {
      return res.status(200).json({
        ok: true,
        msj: "Gastos obtenidos exitosamente",
        gastos,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "No se encontraron gastos",
      gastos: [],
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha habido un error", error });
  }
};

export const obtenerGasto = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);

    const gasto = await prisma.gasto.findUnique({ where: { id: id } });

    if (gasto) {
      return res.status(200).json({
        ok: true,
        msj: "Gasto obtenido exitosamente",
        gasto,
      });
    }

    return res.status(404).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha habido un error", error });
  }
};

export const crearGasto = async (req: Request, res: Response) => {
  try {
    const data = validarGasto(req.body);

    if (!data.success) {
      return res
        .status(422)
        .json({ ok: false, msj: "Error de validación", errors: data.error });
    }

    const { idCaja, monto, comentarios } = data.data;

    const caja = await prisma.caja.findFirst({ where: { id: idCaja } });

    if (caja) {
      if (!caja.estado) {
        return res.status(400).json({
          ok: false,
          msj: "No es posible agregar un gasto a una caja cerrada",
        });
      }

      if (monto > caja.montoActual) {
        return res.status(422).json({
          ok: false,
          msj: "El monto ingresado supera el saldo actual en caja",
        });
      }

      const gasto = await prisma.gasto.create({
        data: { idCaja, monto, comentarios },
      });

      return res.status(200).json({
        ok: true,
        msj: "El gasto se ha registrado exitosamente",
        gasto,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "No se encontró una caja con el ID proporcionado",
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha habido un error al procesar la solicitud", error });
  }
};


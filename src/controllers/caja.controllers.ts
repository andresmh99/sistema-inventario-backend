import { Request, Response } from "express";
import { prisma } from "../database/database";
import { validarCaja } from "../schemas/caja.schema";

export const obtenerCajas = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;
  try {
    const cajas = await prisma.caja.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { fecha: "asc" },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            nombreUsuario: true,
            email: true,
            rol: true,
          },
        },
        ventas: true,
        cierreCaja: true,
        deposito: true,
        _count: true,
      },
    });

    if (cajas) {
      return res.status(200).json({
        ok: true,
        msj: "",
        cajas,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "Caja no encontrada",
      cajas: [],
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};
export const obtenerCajaActiva = async (req: Request, res: Response) => {
  try {
    const caja = await prisma.caja.findFirst({
      where: { estado: true },
    });

    if (caja) {
      return res.status(200).json({
        ok: true,
        msj: "",
        caja,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "Actualmente no existe una caja abierta. Por favor, proceda a iniciar caja antes de realizar una venta.",
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};

export const iniciarCaja = async (req: Request, res: Response) => {
  try {
    const data = validarCaja(req.body);
    if (!data.success) {
      return res
        .status(422)
        .json({ ok: false, msj: JSON.parse(data.error.message) });
    }

    const { idUsuario, montoInicial } = data.data;

    const existeUsuario = await prisma.usuario.findFirst({
      where: { id: idUsuario },
    });

    if (!existeUsuario) {
      return res.status(400).json({
        ok: false,
        msj: `El ID de usuario proporcionado no existe`,
      });
    }

    const cajaIniciada = await prisma.caja.findMany({
      where: { estado: true },
    });

    if (cajaIniciada.length) {
      return res.status(400).json({
        ok: false,
        msj: `Ya existe una caja iniciada  `,
        cajas: cajaIniciada,
      });
    }

    const caja = await prisma.caja.create({
      data: { idUsuario, montoInicial, montoActual: montoInicial },
    });

    return res.status(201).json({
      ok: true,
      msj: `Inicio de caja exitoso `,
      caja,
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};

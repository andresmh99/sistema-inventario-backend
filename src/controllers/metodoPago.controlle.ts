import { Request, Response } from "express";
import { prisma } from "../database/database";

export const obtenerMetodoDePago = async (req: Request, res: Response) => {
  /*const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;*/
  try {
    const metodosPago = await prisma.metodo_pago.findMany({
      //skip: skip,
      //take: pageSize,
      orderBy: { nombre: "asc" },
      
    });

    if (metodosPago) {
      return res.status(200).json({
        ok: true,
        msj: "",
        metodosPago,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "Metodo de pago no encontrado",
      metodosPago: [],
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};
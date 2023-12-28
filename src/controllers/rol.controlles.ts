import { Request, Response } from "express";
import { prisma } from "../database/database";

export const obtenerRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.rol.findMany();

    return res.status(200).json({
      ok: true,
      roles,
    });
  } catch (error) {
    return res.status(500).json({ message: "Ha Habido un error", error });
  }
};

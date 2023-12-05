import { Request, Response } from "express";
import { prisma } from "../database/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const iniciarSesion = async (req: Request, res: Response) => {
  const email = req.body.email;
  const nombreUsuario = req.body.nombreUsuario;
  const password = req.body.password;
  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: email }, { nombreUsuario: nombreUsuario }],
      },
      include: {
        rol: true,
      },
    });
    if (!usuario)
      return res
        .status(404)
        .json({ message: "El email o la contraseña no son correctos" });
    const correctPassword: boolean = await bcrypt.compare(
      password,
      usuario.password
    );
    if (!correctPassword)
      return res
        .status(404)
        .json({ message: "El email o la contraseña no son correctos" });

    const token: string = jwt.sign(
      { id: usuario.id },
      process.env.TOKEN_SECRET_KEY || "TokenIvalid",
      { expiresIn: 3600 }
    );
    usuario.password = "";
    return res.header("auth-token", token).status(200).json({
      ok: true,
      msj: "Ingreso Correcto",
      token,
      usuario,
    });
  } catch (error) {
    return res.status(500).json({ message: "Hubo un problema en el servidor" });
  }
};

import { Request, Response } from "express";
import { prisma } from "../database/database";
import bcrypt from "bcryptjs";

export const getUsuarios = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;

  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombreUsuario: true,
        nombre: true,
        apellido: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        rolId: true,
        rol: {
          select: {
            nombreRol: true,
          },
        },
      },
      skip, // Saltar registros en función de la página
      take: pageSize, // Tomar una cantidad específica de registros por página
    });

    res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: "Algo ha fallado" });
  }
};

export const obtenerUsuario = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: id },
      select: {
        id: true,
        nombreUsuario: true,
        nombre: true,
        apellido: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        rolId: true,
        rol: {
          select: {
            nombreRol: true,
          },
        },
      },
    });
    if (usuario) {
      return res.json(usuario);
    }
    return res.status(404).json({ message: "Registro no encontrado" });
  } catch (error) {
    return res.status(500).json({ message: "algo ha fallado" });
  }
};
export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const existingUserWithUsername = await prisma.usuario.findFirst({
      where: {
        nombreUsuario: req.body.nombreUsuario,
      },
    });

    if (existingUserWithUsername) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso" });
    }

    // Comprobar si el nuevo email ya está en uso
    const existingUserWithEmail = await prisma.usuario.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (existingUserWithEmail) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombreUsuario: req.body.nombreUsuario,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: hashedPassword,
        rolId: parseInt(req.body.rolId),
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: "El Usuario no ha sido creado" });
    }
    return res.json({
      ok: true,
      msj: "Usuario creado con exito",
      usuario: {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rolId: usuario.rolId,
        createdAt: usuario.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "algo ha fallado", error });
  }
};
export const actualizarUsuario = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const usuarioActualizadoData = {
      nombreUsuario: req.body.nombreUsuario,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      password: req.body.password,
      rolId: req.body.rolId,
    };

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      usuarioActualizadoData.password = hashedPassword;
    }
    const existingUserWithUsername = await prisma.usuario.findFirst({
      where: {
        nombreUsuario: req.body.nombreUsuario,
        NOT: {
          id: id, // Excluir el usuario actual que se está actualizando
        },
      },
    });

    if (existingUserWithUsername) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso" });
    }

    // Comprobar si el nuevo email ya está en uso
    const existingUserWithEmail = await prisma.usuario.findFirst({
      where: {
        email: req.body.email,
        NOT: {
          id: id, // Excluir el usuario actual que se está actualizando
        },
      },
    });

    if (existingUserWithEmail) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const usuario = await prisma.usuario.update({
      where: { id: id },
      include: { rol: true },
      data: usuarioActualizadoData,
    });

    if (!usuario) {
      return res.status(404).json({ message: "Registro no Actualizado" });
    }
    return res.json({
      id: usuario.id,
      nombre_usuario: usuario.nombreUsuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rolId: usuario.rolId,
      updatedAt: usuario.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "algo ha fallado", error });
  }
};
export const eliminarUsuario = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const usuario = await prisma.usuario.delete({ where: { id: id } });
    if (!usuario) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "algo ha fallado" });
  }
};

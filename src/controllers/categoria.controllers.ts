import { Request, Response } from "express";
import { prisma } from "../database/database";

export const obtenerCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany();

    return res.status(200).json({
      ok: true,
      categorias,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ha Habido un error", error });
  }
};

export const obtenerCategoria = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);

    const categoria = await prisma.categoria.findUnique({ where: { id: id } });

    if (categoria) {
      return res.status(200).json({
        ok: true,
        categoria,
      });
    }

    return res.status(404).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    return res.status(500).json({ message: "Ha Habido un error", error });
  }
};

export const crearCategoria = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (
      data.nombreCategoria === undefined ||
      data.nombreCategoria === null ||
      data.nombreCategoria === ""
    ) {
      return res.status(400).send({
        ok: false,
        msj: "El nombre de la categoría es requerido, por favor ingrese nombre",
      });
    }
    // Verifica si la categoría ya existe
    const existingCategoria = await prisma.categoria.findUnique({
      where: { nombreCategoria: data.nombreCategoria },
    });

    if (!existingCategoria) {
      // La categoría no existe, así que la creamos
      const categoria = await prisma.categoria.create({
        data: data,
      });
      return res.status(200).send({
        ok: true,
        msj: "La categoría se ha registrado exitosamente",
        categoria,
      });
    }

    return res.status(403).send({
      ok: false,
      msj: "La categoría ingresada ya existe, por favor ingrese un nombre diferente",
    });
  } catch (error) {
    return res.status(500).json({ message: "Ha Habido un error", error });
  }
};

export const actualizarCategoria = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);
    const existingCategoryWithName = await prisma.categoria.findFirst({
      where: {
        nombreCategoria: req.body.nombreCategoria,
        NOT: {
          id: id, // Excluir el usuario actual que se está actualizando
        },
      },
    });
    if (existingCategoryWithName) {
      return res.status(403).send({
        ok: false,
        msj: "La categoría ingresada ya existe, por favor ingrese un nombre diferente",
      });
    }

    const categoria = await prisma.categoria.update({
      where: { id: id },
      data: req.body,
    });
    if (categoria) {
      return res.json({
        ok: true,
        categoria,
      });
    }
    return res.status(403).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "No se ha encontrado registro", error });
  }
};

export const eliminarCategoria = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);

    const categoria = await prisma.categoria.delete({ where: { id: id } });

    if (categoria) {
      return res.sendStatus(204);
    }
    return res.status(403).send({
      ok: false,
      msj: "No se ha podido completar la acción, por favor intente de nuevo",
    });
  } catch (error) {
    return res.status(500).json({ message: "Ha Habido un error", error });
  }
};

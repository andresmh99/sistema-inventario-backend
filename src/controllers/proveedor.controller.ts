import { Request, Response } from "express";
import { prisma } from "../database/database";

export const obtenerProveedores = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;
  try {
    const proveedores = await prisma.proveedor.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { nombre: "asc" },
      include: { compras: false, _count: true },
    });

    const totalCount = await prisma.proveedor.count();
    const pageCount = Math.ceil(totalCount / pageSize);

    const info = {
      count: totalCount,
      pages: pageCount,
    };

    if (proveedores) {
      return res.status(200).json({
        ok: true,
        info,
        msj: "",
        proveedores,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "No existen proveedores registrados",
      proveedores: [],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msj: "Ha Habido un error", error });
  }
};

export const obtenerProveedor = async (req: Request, res: Response) => {
  try {
    
    const id = parseInt(req.params["id"]);

    const proveedor = await prisma.proveedor.findUnique({ where: { id: id } });

    if (proveedor) {
      return res.status(200).json({
        ok: true,
        proveedor,
      });
    }

    return res.status(404).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msj: "Ha Habido un error", error });
  }
};

export const crearProveedor = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (
      data.nombre === undefined ||
      data.nombre === null ||
      data.nombre === ""
    ) {
      return res.status(400).send({
        ok: false,
        msj: "El nombre del proveedor es requerido, por favor ingrese nombre",
      });
    }
    // Verifica si el proveedor ya existe
    const existeProveedor = await prisma.proveedor.findUnique({
      where: { nombre: data.nombre },
    });

    if (!existeProveedor) {
      // el proveedor no existe, así que la creamos
      const proveedor = await prisma.proveedor.create({
        data: data,
      });
      return res.status(200).send({
        ok: true,
        msj: "El proveedor se ha registrado exitosamente",
        proveedor,
      });
    }

    return res.status(403).send({
      ok: false,
      msj: "El proveedor ingresado ya existe, por favor ingrese un nombre diferente",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msj: "Ha Habido un error", error });
  }
};

export const actualizarProveedor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);
    const existingCategoryWithName = await prisma.proveedor.findFirst({
      where: {
        nombre: req.body.nombre,
        NOT: {
          id: id, // Excluir el usuario actual que se está actualizando
        },
      },
    });
    if (existingCategoryWithName) {
      return res.status(403).send({
        ok: false,
        msj: "El proveedor ingresada ya existe, por favor ingrese un nombre diferente",
      });
    }

    const proveedor = await prisma.proveedor.update({
      where: { id: id },
      data: req.body,
    });
    if (proveedor) {
      return res.json({
        ok: true,
        proveedor,
      });
    }
    return res.status(403).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    return res
      .status(404)
      .json({ ok: false, msj: "No se ha encontrado registro", error });
  }
};

export const eliminarProveedor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);

    // Buscar El proveedor que se va a eliminar
    const proveedorAEliminar = await prisma.proveedor.findUnique({
      where: { id: id },
    });

    if (!proveedorAEliminar) {
      return res
        .status(404)
        .json({ ok: false, msj: "Proveedor no encontrado" });
    } else if (proveedorAEliminar.id === 1) {
      return res.status(500).json({
        ok: false,
        msj: "No se puede eliminar el Proveedor por defecto",
      });
    }

    // Buscar las compras asociados a el proveedor que se eliminará
    const compras = await prisma.compra.findMany({
      where: { idProveedor: id },
    });

    // Actualizar las compras cambiando su proveedor a el proveedor predeterminada "Sin proveedor" (id = 0)
    await Promise.all(
      compras.map(async (compra) => {
        await prisma.compra.update({
          where: { id: compra.id },
          data: {
            idProveedor: 1, // ID de el proveedor sin proveedor
          },
        });
      })
    );

    const proveedor = await prisma.proveedor.delete({ where: { id: id } });

    if (proveedor) {
      return res.status(200).json({
        ok: true,
        msj: "proveedor " + proveedor.nombre + " Eliminada exitosamente",
      });
    }
    return res.status(403).send({
      ok: false,
      msj: "No se ha podido completar la acción, por favor intente de nuevo",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msj: "Ha Habido un error", error });
  }
};
export const filtroProveedor = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;
  try {
    const data = req.query["s"] as string;
    const proveedores = await prisma.proveedor.findMany({
      where: {
        OR: [{ nombre: { startsWith: data, mode: "insensitive" } }],
      },
      skip: skip,
      take: pageSize,
      orderBy: { nombre: "asc" },
    });

    const totalCount = await prisma.proveedor.count();
    const pageCount = Math.ceil(totalCount / pageSize);

    const info = {
      count: totalCount,
      pages: pageCount,
    };

    if (proveedores.length > 0) {
      return res.status(200).json({
        ok: true,
        msj: "",
        proveedores,
        info,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "Proveedor no encontrado",
      proveedores: [],
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msj: "Error al buscar Proveedor",
      error,
    });
  }
};

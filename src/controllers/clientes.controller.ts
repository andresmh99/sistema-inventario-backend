import { Request, Response } from "express";
import { prisma } from "../database/database";

export const obtenerClientes = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;
  try {
    const clientes = await prisma.cliente.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { nombre: "asc" },
    });

    if (clientes) {
      return res.status(200).json({
        ok: true,
        msj: "",
        clientes,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "No existen clientes registrados",
      clientes: [],
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};

export const obtenerCliente = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);

    const cliente = await prisma.cliente.findUnique({ where: { id: id } });

    if (cliente) {
      return res.status(200).json({
        ok: true,
        cliente,
      });
    }

    return res.status(404).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};

export const crearCliente = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (
      data.nombre === undefined ||
      data.nombre === null ||
      data.nombre === ""
    ) {
      return res.status(400).send({
        ok: false,
        msj: "El nombre del cliente es requerido, por favor ingrese nombre",
      });
    }
    // Verifica si la cliente ya existe
    const existecliente = await prisma.cliente.findUnique({
      where: { run: data.run },
    });

    if (!existecliente) {
      // La cliente no existe, así que la creamos
      const cliente = await prisma.cliente.create({
        data: data,
      });
      return res.status(200).send({
        ok: true,
        msj: "El cliente se ha registrado exitosamente",
        cliente,
      });
    }

    return res.status(403).send({
      ok: false,
      msj: "El cliente ingresado ya existe, por favor ingrese un nombre diferente",
    });
  } catch (error) {
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};

export const actualizarCliente = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);
    const existingCategoryWithName = await prisma.cliente.findFirst({
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
        msj: "El Cliente ingresada ya existe, por favor ingrese un nombre diferente",
      });
    }

    const cliente = await prisma.cliente.update({
      where: { id: id },
      data: req.body,
    });
    if (cliente) {
      return res.json({
        ok: true,
        cliente,
      });
    }
    return res.status(403).send({
      ok: false,
      msj: "El registro indicado no existe, por favor intente nuevamente",
    });
  } catch (error) {
    return res.status(404).json({ msj: "No se ha encontrado registro", error });
  }
};

export const eliminarCliente = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);

    // Buscar El Cliente que se va a eliminar
    const clienteAEliminar = await prisma.cliente.findUnique({
      where: { id: id },
    });

    if (!clienteAEliminar) {
      return res
        .status(404)
        .json({ ok: false, msj: "cliente no encontrado" });
    } else if (clienteAEliminar.id === 1) {
      return res
        .status(500)
        .json({
          ok: false,
          msj: "No se puede eliminar el cliente por defecto",
        });
    }

    // Buscar los productos asociados a El Cliente que se eliminará
    const ventas = await prisma.venta.findMany({
      where: { idCliente: id },
    });

    // Actualizar los productos cambiando su cliente a El Cliente predeterminada sin cliente (id = 0)
    await Promise.all(
      ventas.map(async (venta) => {
        await prisma.venta.update({
          where: { id: venta.id },
          data: {
            idCliente: 1, // ID de El Cliente sin cliente
          },
        });
      })
    );

    const cliente = await prisma.cliente.delete({ where: { id: id } });

    if (cliente) {
      return res.status(200).json({
        ok: true,
        msj:
          "Cliente " + cliente.nombre + " Eliminado exitosamente",
      });
    }
    return res.status(403).send({
      ok: false,
      msj: "No se ha podido completar la acción, por favor intente de nuevo",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msj: "Ha Habido un error", error });
  }
};

export const filtroClientes = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;
  try {
    const data = req.query["s"] as string;
    const clientes = await prisma.cliente.findMany({
      where: {
        OR: [
          { nombre: { startsWith: data, mode: "insensitive" } },
          { run: { startsWith: data, mode: "insensitive" } },
        ],
      },
      skip: skip,
      take: pageSize,
      orderBy: { nombre: "asc" },
    });

    const totalCount = await prisma.cliente.count();
    const pageCount = Math.ceil(totalCount / pageSize);

    const info = {
      count: totalCount,
      pages: pageCount,
    };

    if (clientes.length > 0) {
      return res.status(200).json({
        ok: true,
        msj: "",
        clientes,
        info,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "cliente no encontrado",
      clientes: [],
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msj: "Error al buscar cliente",
      error,
    });
  }
};

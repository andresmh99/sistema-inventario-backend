import { Request, Response } from "express";
import { prisma } from "../database/database";
import { crearDetalleCompra } from "./detalleCompra.controllers";

export const obtenerCompras = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = 10;
  const skip: number = (page - 1) * pageSize;
  try {
    const compras = await prisma.compra.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { fecha: "asc" },
      include: { detalleCompra: true, _count: true },
    });

    const totalCount = await prisma.compra.count();
    const pageCount = Math.ceil(totalCount / pageSize);

    const info = {
      count: totalCount,
      pages: pageCount,
    };

    if (compras) {
      return res.status(200).json({
        ok: true,
        info,
        msj: "",
        compras,
      });
    }

    return res.status(404).json({
      ok: false,
      msj: "No existen compras registradas",
      compras: [],
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

export const crearCompra = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (isNaN(data.idProveedor)) {
      return res.status(500).json({
        ok: false,
        msj: "El ID del proveedor ingresado es incorrecto",
      });
    } else if (data.idProveedor === undefined || data.idProveedor === null) {
      data.idProveedor = 1;
    }
    // Verifica si el proveedor ya existe
    const existeProveedor = await prisma.proveedor.findUnique({
      where: { id: data.idProveedor },
    });

    if (!existeProveedor) {
      // el proveedor no existe, así que la creamos
      data.idProveedor = 1;
    }

    let montoTotal = 0;

    const compra = await prisma.compra.create({
        data: {
          proveedor: { connect: { id: data.idProveedor } },
          montoTotal: montoTotal
        },
      });
  
      
  
      // Iterar sobre los detalles de los productos
      for (const detalle of data.detalleCompra) {
        const { idProducto, cantidad, precioCompra } = detalle;
  
        // Crear el detalle de compra asociado a la compra creada anteriormente
        await prisma.detalleCompra.create({
          data: {
            compra: { connect: { id: compra.id } },
            producto: { connect: { id: idProducto } },
            cantidad,
            precioCompra: precioCompra,
          },
        });
  
        // Calcular el monto total sumando el precio de cada producto
        montoTotal += cantidad * precioCompra;
      }

     const resultado= await prisma.compra.update({
        where: { id: compra.id },
        data: { montoTotal },
      });

    return res.status(200).send({
      ok: true,
      msj: "La compra se ha registrado exitosamente",
      resultado
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msj: "Ha Habido un error", error });
  }
};

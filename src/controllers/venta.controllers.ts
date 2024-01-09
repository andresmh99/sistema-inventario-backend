import { Request, Response } from "express";
import { prisma } from "../database/database";
import { validarMontoVenta, validarVenta } from "../schemas/venta.schema";

interface DetalleVenta {
  cantidad: number;
  idProducto: number;
}

async function calcularMontoTotalVenta(
  detallesVenta: DetalleVenta[]
): Promise<number> {
  let montoTotal = 0;

  for (const detalle of detallesVenta) {
    const producto = await prisma.producto.findUnique({
      where: { id: detalle.idProducto },
    });

    if (producto) {
      montoTotal += producto.precioVenta * detalle.cantidad;
    }
  }

  return montoTotal;
}
export const obtenerVentas = async (req: Request, res: Response) => {
  try {
    // Consulta todas las ventas con sus detalles y montos asociados
    const ventas = await prisma.venta.findMany({
      include: {
        detalleVentas: {
          include: {
            producto: true,
          },
        },
        montoVentas: {
          include: {
            metodoPago: true,
          },
        },
        cliente: true,
        usuario: true,
      },
    });

    return res.status(200).json({ ventas });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const crearVenta = async (req: Request, res: Response) => {
  try {
    const data = validarVenta(req.body);
    if (!data.success) {
      return res
        .status(422)
        .json({ ok: false, msj: JSON.parse(data.error.message) });
    }
    const { idUsuario, idCliente, detallesVenta } = data.data;

    // Calcular el monto total de la venta basado en los detalles de venta
    const montoTotalCalculado = await calcularMontoTotalVenta(detallesVenta);

    // Crear la venta
    const nuevaVenta = await prisma.venta.create({
      data: {
        montoTotal: montoTotalCalculado,
        idUsuario,
        idCliente,
        estado: false,
        montoPendiente: montoTotalCalculado,
        detalleVentas: {
          create: detallesVenta.map((detalle) => ({
            cantidad: detalle.cantidad,
            producto: { connect: { id: detalle.idProducto } },
          })),
        },
      },
      include: {
        detalleVentas: true,
      },
    });

    return res.status(201).json({
      ok: true,
      msj: `Venta ingresada correctamente, el total a pagar es de: ${montoTotalCalculado} CLP `,
      venta: nuevaVenta,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const crearMontoVenta = async (req: Request, res: Response) => {
  try {
    const dataRequest = {
      idVenta: parseInt(req.params["idVenta"]),
      ...req.body,
    };
    const dataValidada = validarMontoVenta(dataRequest);

    if (!dataValidada.success) {
      return res.status(422).json({
        ok: false,
        msj: JSON.parse(dataValidada.error.message),
      });
    }

    const { idVenta, idMetodoPago, monto } = dataValidada.data;

    const venta = await prisma.venta.findUnique({
      where: { id: idVenta },
      include: { montoVentas: true },
    });

    if (!venta) {
      return res.status(404).json({
        ok: false,
        msj: "La venta no fue encontrada.",
      });
    }
    const metodoPagoValido = await prisma.metodo_pago.findUnique({
      where: { id: idMetodoPago },
    });

    if (!metodoPagoValido) {
      return res.status(400).json({
        ok: false,
        msj: "El ID del método de pago ingresado no es válido.",
      });
    }

    const montoPendiente =
      venta.montoTotal -
      (venta.montoVentas.reduce((total, monto) => total + monto.monto, 0) || 0);

    if (monto > montoPendiente) {
      return res.status(400).json({
        ok: false,
        msj: `El monto: ${monto} CLP ingresado es mayor que el total pendiente.`,
        montoPendiente,
      });
    }

    const montoIngresado = await prisma.montoVenta.create({
      data: { monto, idMetodoPago, idVenta },
    });

    const nuevosMontosVenta = [...venta.montoVentas, montoIngresado];
    const totalPagado = nuevosMontosVenta.reduce(
      (total, monto) => total + monto.monto,
      0
    );

    if (totalPagado === venta.montoTotal) {
      const ventaCancelada = await prisma.venta.update({
        where: { id: idVenta },
        data: {
          estado: true,
          montoPendiente: 0,
          montoVentas: { set: nuevosMontosVenta },
        },
      });
      return res.status(200).json({
        ok: true,
        msj: `Venta cancelada en su totalidad.`,
        venta: ventaCancelada,
      });
    } else {
      const nuevoMontoPendiente = venta.montoTotal - totalPagado;
      await prisma.venta.update({
        where: { id: idVenta },
        data: {
          montoPendiente: nuevoMontoPendiente,
          montoVentas: { set: nuevosMontosVenta },
        },
      });
      return res.status(200).json({
        ok: true,
        msj: `Monto ingresado correctamente, total pendiente por pagar: ${nuevoMontoPendiente} CLP`,
        montoPendiente: nuevoMontoPendiente,
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msj: "Hubo un error al procesar la solicitud.",
      error: error,
    });
  }
};

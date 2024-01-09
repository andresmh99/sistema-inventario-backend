import { Request, Response } from "express";
import { prisma } from "../database/database";

export interface IDetalleCompra {
  detalleCompra: detalleCompra[];
}
export interface detalleCompra {
  cantidad: number;
  idProducto: number;
  idCompra: number;
  precioCompra: number;
}

export const crearDetalleCompra = async (
  req: IDetalleCompra
) => {
  try {
    const data = req;
    var detalle = [];
    var errores = [];
    var montoTotal = 0;

    for (let i = 0; i < data.detalleCompra.length; i++) {
      const element = data.detalleCompra[i];

      const resultado = await prisma.detalleCompra.create({ data: element });
      if (resultado) {
        detalle.push(resultado);
        montoTotal = montoTotal + (resultado.cantidad * resultado.precioCompra)
      } else {
        errores.push(resultado);
      }
    }
    console.log(detalle);
    return montoTotal
    
  } catch (error) {
    console.log(error);
  }
};

import z from "zod";

const detalleVentaSchema = z.object({
  cantidad: z
    .number({
      invalid_type_error: "La cantidad debe ser numerica",
      required_error: "La cantidad es requerida",
    })
    .int({ message: "La cantidad debe ser un numero entero" })
    .positive({ message: "La cantidad debe ser positiva" }),
  idProducto: z
    .number({
      invalid_type_error: "El ID del producto debe ser numerica",
      required_error: "El ID del producto es requerida",
    })
    .int({ message: "El ID del producto debe ser un numero entero" })
    .positive({ message: "El ID del producto debe ser positivo" }),
    
});

const ventaSchema = z.object({
  idUsuario: z
    .number({
      invalid_type_error: "El ID del usuario debe ser numerico",
      required_error: "El ID del usuario es requerido",
    })
    .int({ message: "El ID del usuario debe ser un numero entero" })
    .positive({ message: "El ID del usuario debe ser positivo" }),
  idCliente: z
    .number({
      invalid_type_error: "El ID del cliente debe ser numerico",
      required_error: "El ID del cliente es requerido",
    })
    .int({ message: "El ID del cliente debe ser un numero entero" })
    .positive({ message: "El ID del cliente debe ser positivo" }),
    idCaja: z
    .number({
      invalid_type_error: "El ID de la caja debe ser numerico",
      required_error: "El ID de la caja es requerido",
    })
    .int({ message: "El ID de la caja debe ser un numero entero" })
    .positive({ message: "El ID de la caja debe ser positivo" }),

  detallesVenta: z.array(detalleVentaSchema),
});

const montoVentaSchema = z.object({
  idVenta: z
    .number({
      invalid_type_error: "El ID de la venta debe ser numerico",
      required_error: "El ID de la venta es requerido",
    })
    .int({ message: "El ID de la venta debe ser un numero entero" })
    .positive({ message: "El ID de la venta debe ser positivo" }),
  monto: z
    .number({
      invalid_type_error: "El monto debe ser numérico",
      required_error: "El monto es requerido",
    })
    .positive({ message: "El monto debe ser un número positivo" }),
  idMetodoPago: z
    .number({
      invalid_type_error: "El ID del método de pago debe ser numérico",
      required_error: "El ID del método de pago es requerido",
    })
    .int({ message: "El ID del método de pago debe ser un número entero" })
    .positive({ message: "El ID del método de pago debe ser positivo" }),

});

export function validarVenta(object: object) {
  return ventaSchema.safeParse(object);
}

export function validarMontoVenta(object: object) {
  return montoVentaSchema.safeParse(object);
}

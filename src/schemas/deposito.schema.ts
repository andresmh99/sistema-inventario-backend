import z from "zod";

const depositoSchema = z.object({
    idCaja: z
    .number({
      invalid_type_error: "El ID de la caja debe ser numerico",
      required_error: "El ID de la caja es requerido",
    })
    .int({ message: "El ID de la caja debe ser un numero entero" })
    .positive({ message: "El ID de la caja debe ser positivo" }),
    idCierreCaja: z
    .number({
      invalid_type_error: "El ID del cierre de la caja debe ser numerico",
      required_error: "El ID del cierre de la caja es requerido",
    })
    .int({ message: "El ID del cierre de la caja debe ser un numero entero" })
    .positive({ message: "El ID del cierre de la caja debe ser positivo" }),
    montoDeposito: z
    .number({
      invalid_type_error: "El Monto del deposito debe ser numerico",
      required_error: "El Monto del deposito es requerido",
    })
    .positive({ message: "El Monto del deposito debe ser positivo" }),
});

export function validarDepositoCaja(object: object) {
  return depositoSchema.safeParse(object);
}
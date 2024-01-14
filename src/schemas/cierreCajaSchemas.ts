
import z, { map } from "zod";

const cierreCajaSchema = z.object({
  idCaja: z
    .number({
      invalid_type_error: "El ID de la caja debe ser numerico",
      required_error: "El ID de la caja es requerido",
    })
    .int({ message: "El ID de la caja debe ser un numero entero" })
    .positive({ message: "El ID de la caja debe ser positivo" }),
  montoCierre: z
    .number({
      invalid_type_error: "El Monto de cierre debe ser numerico",
      required_error: "El Monto de cierre es requerido",
    })
    .positive({ message: "El Monto de cierre debe ser positivo" }),
});

export function validarCaja(object: object) {
  return cierreCajaSchema.safeParse(object);
}
import z from "zod";

const cajaSchema = z.object({
  idUsuario: z
    .number({
      invalid_type_error: "El ID de usuario debe ser numerico",
      required_error: "El ID de usuario es requerido",
    })
    .int({ message: "El ID de usuario debe ser un numero entero" })
    .positive({ message: "El ID de usuario debe ser positiva" }),

  montoInicial: z
    .number({
      invalid_type_error: "El Monto Inicial debe ser numerico",
      required_error: "El Monto Inicial es requerido",
    })
    .int({ message: "El Monto Inicial debe ser un numero entero" })
    .positive({ message: "El Monto Inicial debe ser positivo" }),
});

export function validarCaja(object: object) {
  return cajaSchema.safeParse(object);
}

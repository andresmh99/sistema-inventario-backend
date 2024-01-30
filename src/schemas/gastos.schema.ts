import z from "zod";

const gastoSchema = z.object({
  idCaja: z
    .number({
      invalid_type_error: "El ID de Caja debe ser numerico",
      required_error: "El ID de Caja es requerido",
    })
    .int({ message: "El ID de Caja debe ser un numero entero" })
    .positive({ message: "El ID de Caja debe ser positivo" }),

  monto: z
    .number({
      invalid_type_error: "El Monto debe ser numerico",
      required_error: "El Monto es requerido",
    })
    .int({ message: "El Monto debe ser un numero entero" })
    .positive({ message: "El Monto debe ser positivo" }),
  comentarios: z
    .string()
    .max(150, {
      message: "La descripción debe tener como máximo 150 caracteres",
    })
    .optional(),
});

export function validarGasto(object: object) {
  return gastoSchema.safeParse(object);
}

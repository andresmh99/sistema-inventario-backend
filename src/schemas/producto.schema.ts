import z from "zod";

const productoSchema = z.object({
  nombreProducto: z.string({
    invalid_type_error: "El nombre del producto debe ser una cadena de texto",
    required_error: "El nombre del producto es requerido",
  }),
  sku: z.string({
    invalid_type_error: "El SKU debe ser una cadena de texto",
    required_error: "El SKU es requerido",
  }),
  precioVenta: z
    .number({
      invalid_type_error: "El precio de venta debe ser un valor numérico",
      required_error: "El precio de venta es requerido",
    })
    .int({ message: "El precio de venta debe ser un número entero" })
    .positive({ message: "El precio de venta debe ser positivo" }),
  precioCompra: z
    .number({
      invalid_type_error: "El precio de compra debe ser un valor numérico",
      required_error: "El precio de compra es requerido",
    })
    .int({ message: "El precio de compra debe ser un número entero" })
    .positive({ message: "El precio de compra debe ser positivo" }),
  stock: z
    .number({
      invalid_type_error: "El stock debe ser un valor numérico",
      required_error: "El stock es requerido",
    })
    .int({ message: "El stock debe ser un número entero" })
    .positive({ message: "El stock debe ser positivo" }),
  marca: z.string({
    invalid_type_error: "La marca debe ser una cadena de texto",
    required_error: "La marca es requerida",
  }),
  idCategoria: z
    .number({
      invalid_type_error: "El ID de la categoría debe ser un valor numérico",
      required_error: "El ID de la categoría es requerido",
    })
    .int({ message: "El ID de la categoría debe ser un número entero" })
    .positive({ message: "El ID de la categoría debe ser positivo" }),
  descripcion: z
    .string({
      invalid_type_error: "La descripción debe ser una cadena de texto",
    })
    .optional(),
  public_image_id: z
    .string({
      invalid_type_error:
        "El ID de la imagen pública debe ser una cadena de texto",
    })
    .optional(),
  secure_image_url: z
    .string({
      invalid_type_error:
        "La URL segura de la imagen debe ser una cadena de texto",
    })
    .url({ message: "La URL segura de la imagen debe ser válida" })
    .optional(),
});

const actualizarProductoSchema = z.object({
  params: z.object({
    id: z
      .number({
        invalid_type_error: "El ID del producto debe ser un valor numérico",
        required_error: "El ID del producto es requerido",
      })
      .int({ message: "El ID del producto debe ser un número entero" })
      .positive({ message: "El ID del producto debe ser positivo" }),
  }),
  body: productoSchema,
});

export function validarProducto(object: object) {
  return productoSchema.safeParse(object);
}

export function validarProductoParcial(object: object) {
  return actualizarProductoSchema.partial().safeParse(object);
}

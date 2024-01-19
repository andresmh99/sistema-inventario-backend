"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarProductoParcial = exports.validarProducto = void 0;
const zod_1 = __importDefault(require("zod"));
const productoSchema = zod_1.default.object({
    nombreProducto: zod_1.default.string({
        invalid_type_error: "El nombre del producto debe ser una cadena de texto",
        required_error: "El nombre del producto es requerido",
    }),
    sku: zod_1.default.string({
        invalid_type_error: "El SKU debe ser una cadena de texto",
        required_error: "El SKU es requerido",
    }),
    precioVenta: zod_1.default
        .number({
        invalid_type_error: "El precio de venta debe ser un valor numérico",
        required_error: "El precio de venta es requerido",
    })
        .int({ message: "El precio de venta debe ser un número entero" })
        .positive({ message: "El precio de venta debe ser positivo" }),
    precioCompra: zod_1.default
        .number({
        invalid_type_error: "El precio de compra debe ser un valor numérico",
        required_error: "El precio de compra es requerido",
    })
        .int({ message: "El precio de compra debe ser un número entero" })
        .positive({ message: "El precio de compra debe ser positivo" }),
    stock: zod_1.default
        .number({
        invalid_type_error: "El stock debe ser un valor numérico",
        required_error: "El stock es requerido",
    })
        .int({ message: "El stock debe ser un número entero" })
        .positive({ message: "El stock debe ser positivo" }),
    marca: zod_1.default.string({
        invalid_type_error: "La marca debe ser una cadena de texto",
        required_error: "La marca es requerida",
    }),
    idCategoria: zod_1.default
        .number({
        invalid_type_error: "El ID de la categoría debe ser un valor numérico",
        required_error: "El ID de la categoría es requerido",
    })
        .int({ message: "El ID de la categoría debe ser un número entero" })
        .positive({ message: "El ID de la categoría debe ser positivo" }),
    descripcion: zod_1.default
        .string({
        invalid_type_error: "La descripción debe ser una cadena de texto",
    })
        .optional(),
    public_image_id: zod_1.default
        .string({
        invalid_type_error: "El ID de la imagen pública debe ser una cadena de texto",
    })
        .optional(),
    secure_image_url: zod_1.default
        .string({
        invalid_type_error: "La URL segura de la imagen debe ser una cadena de texto",
    })
        .url({ message: "La URL segura de la imagen debe ser válida" })
        .optional(),
});
const actualizarProductoSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default
            .number({
            invalid_type_error: "El ID del producto debe ser un valor numérico",
            required_error: "El ID del producto es requerido",
        })
            .int({ message: "El ID del producto debe ser un número entero" })
            .positive({ message: "El ID del producto debe ser positivo" }),
    }),
    body: productoSchema,
});
function validarProducto(object) {
    return productoSchema.safeParse(object);
}
exports.validarProducto = validarProducto;
function validarProductoParcial(object) {
    return actualizarProductoSchema.partial().safeParse(object);
}
exports.validarProductoParcial = validarProductoParcial;

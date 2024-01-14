"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarMontoVenta = exports.validarVenta = void 0;
const zod_1 = __importDefault(require("zod"));
const detalleVentaSchema = zod_1.default.object({
    cantidad: zod_1.default
        .number({
        invalid_type_error: "La cantidad debe ser numerica",
        required_error: "La cantidad es requerida",
    })
        .int({ message: "La cantidad debe ser un numero entero" })
        .positive({ message: "La cantidad debe ser positiva" }),
    idProducto: zod_1.default
        .number({
        invalid_type_error: "El ID del producto debe ser numerica",
        required_error: "El ID del producto es requerida",
    })
        .int({ message: "El ID del producto debe ser un numero entero" })
        .positive({ message: "El ID del producto debe ser positivo" }),
});
const ventaSchema = zod_1.default.object({
    idUsuario: zod_1.default
        .number({
        invalid_type_error: "El ID del usuario debe ser numerico",
        required_error: "El ID del usuario es requerido",
    })
        .int({ message: "El ID del usuario debe ser un numero entero" })
        .positive({ message: "El ID del usuario debe ser positivo" }),
    idCliente: zod_1.default
        .number({
        invalid_type_error: "El ID del cliente debe ser numerico",
        required_error: "El ID del cliente es requerido",
    })
        .int({ message: "El ID del cliente debe ser un numero entero" })
        .positive({ message: "El ID del cliente debe ser positivo" }),
    idCaja: zod_1.default
        .number({
        invalid_type_error: "El ID de la caja debe ser numerico",
        required_error: "El ID de la caja es requerido",
    })
        .int({ message: "El ID de la caja debe ser un numero entero" })
        .positive({ message: "El ID de la caja debe ser positivo" }),
    detallesVenta: zod_1.default.array(detalleVentaSchema),
});
const montoVentaSchema = zod_1.default.object({
    idVenta: zod_1.default
        .number({
        invalid_type_error: "El ID de la venta debe ser numerico",
        required_error: "El ID de la venta es requerido",
    })
        .int({ message: "El ID de la venta debe ser un numero entero" })
        .positive({ message: "El ID de la venta debe ser positivo" }),
    monto: zod_1.default
        .number({
        invalid_type_error: "El monto debe ser numérico",
        required_error: "El monto es requerido",
    })
        .positive({ message: "El monto debe ser un número positivo" }),
    idMetodoPago: zod_1.default
        .number({
        invalid_type_error: "El ID del método de pago debe ser numérico",
        required_error: "El ID del método de pago es requerido",
    })
        .int({ message: "El ID del método de pago debe ser un número entero" })
        .positive({ message: "El ID del método de pago debe ser positivo" }),
});
function validarVenta(object) {
    return ventaSchema.safeParse(object);
}
exports.validarVenta = validarVenta;
function validarMontoVenta(object) {
    return montoVentaSchema.safeParse(object);
}
exports.validarMontoVenta = validarMontoVenta;

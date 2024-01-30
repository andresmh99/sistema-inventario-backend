"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarGasto = void 0;
const zod_1 = __importDefault(require("zod"));
const gastoSchema = zod_1.default.object({
    idCaja: zod_1.default
        .number({
        invalid_type_error: "El ID de Caja debe ser numerico",
        required_error: "El ID de Caja es requerido",
    })
        .int({ message: "El ID de Caja debe ser un numero entero" })
        .positive({ message: "El ID de Caja debe ser positivo" }),
    monto: zod_1.default
        .number({
        invalid_type_error: "El Monto debe ser numerico",
        required_error: "El Monto es requerido",
    })
        .int({ message: "El Monto debe ser un numero entero" })
        .positive({ message: "El Monto debe ser positivo" }),
    comentarios: zod_1.default
        .string()
        .max(150, {
        message: "La descripción debe tener como máximo 150 caracteres",
    })
        .optional(),
});
function validarGasto(object) {
    return gastoSchema.safeParse(object);
}
exports.validarGasto = validarGasto;

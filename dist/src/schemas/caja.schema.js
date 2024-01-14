"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCaja = void 0;
const zod_1 = __importDefault(require("zod"));
const cajaSchema = zod_1.default.object({
    idUsuario: zod_1.default
        .number({
        invalid_type_error: "El ID de usuario debe ser numerico",
        required_error: "El ID de usuario es requerido",
    })
        .int({ message: "El ID de usuario debe ser un numero entero" })
        .positive({ message: "El ID de usuario debe ser positiva" }),
    montoInicial: zod_1.default
        .number({
        invalid_type_error: "El Monto Inicial debe ser numerico",
        required_error: "El Monto Inicial es requerido",
    })
        .int({ message: "El Monto Inicial debe ser un numero entero" })
        .positive({ message: "El Monto Inicial debe ser positivo" }),
});
function validarCaja(object) {
    return cajaSchema.safeParse(object);
}
exports.validarCaja = validarCaja;

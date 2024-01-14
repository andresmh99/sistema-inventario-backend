"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarDepositoCaja = void 0;
const zod_1 = __importDefault(require("zod"));
const depositoSchema = zod_1.default.object({
    idCaja: zod_1.default
        .number({
        invalid_type_error: "El ID de la caja debe ser numerico",
        required_error: "El ID de la caja es requerido",
    })
        .int({ message: "El ID de la caja debe ser un numero entero" })
        .positive({ message: "El ID de la caja debe ser positivo" }),
    idCierreCaja: zod_1.default
        .number({
        invalid_type_error: "El ID del cierre de la caja debe ser numerico",
        required_error: "El ID del cierre de la caja es requerido",
    })
        .int({ message: "El ID del cierre de la caja debe ser un numero entero" })
        .positive({ message: "El ID del cierre de la caja debe ser positivo" }),
    montoDeposito: zod_1.default
        .number({
        invalid_type_error: "El Monto del deposito debe ser numerico",
        required_error: "El Monto del deposito es requerido",
    })
        .positive({ message: "El Monto del deposito debe ser positivo" }),
});
function validarDepositoCaja(object) {
    return depositoSchema.safeParse(object);
}
exports.validarDepositoCaja = validarDepositoCaja;

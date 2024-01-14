"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCierreCaja = void 0;
const zod_1 = __importDefault(require("zod"));
const cierreCajaSchema = zod_1.default.object({
    idCaja: zod_1.default
        .number({
        invalid_type_error: "El ID de la caja debe ser numerico",
        required_error: "El ID de la caja es requerido",
    })
        .int({ message: "El ID de la caja debe ser un numero entero" })
        .positive({ message: "El ID de la caja debe ser positivo" }),
    montoCierre: zod_1.default
        .number({
        invalid_type_error: "El Monto de cierre debe ser numerico",
        required_error: "El Monto de cierre es requerido",
    })
        .positive({ message: "El Monto de cierre debe ser positivo" }),
});
function validarCierreCaja(object) {
    return cierreCajaSchema.safeParse(object);
}
exports.validarCierreCaja = validarCierreCaja;

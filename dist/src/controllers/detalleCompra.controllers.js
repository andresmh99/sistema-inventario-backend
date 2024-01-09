"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearDetalleCompra = void 0;
const database_1 = require("../database/database");
const crearDetalleCompra = async (req) => {
    try {
        const data = req;
        var detalle = [];
        var errores = [];
        var montoTotal = 0;
        for (let i = 0; i < data.detalleCompra.length; i++) {
            const element = data.detalleCompra[i];
            const resultado = await database_1.prisma.detalleCompra.create({ data: element });
            if (resultado) {
                detalle.push(resultado);
                montoTotal = montoTotal + (resultado.cantidad * resultado.precioCompra);
            }
            else {
                errores.push(resultado);
            }
        }
        console.log(detalle);
        return montoTotal;
    }
    catch (error) {
        console.log(error);
    }
};
exports.crearDetalleCompra = crearDetalleCompra;

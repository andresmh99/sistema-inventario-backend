"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerMetodoDePago = void 0;
const database_1 = require("../database/database");
const obtenerMetodoDePago = async (req, res) => {
    /*const page: number = Number(req.query.page) || 1;
    const pageSize: number = 10;
    const skip: number = (page - 1) * pageSize;*/
    try {
        const metodosPago = await database_1.prisma.metodo_pago.findMany({
            //skip: skip,
            //take: pageSize,
            orderBy: { nombre: "asc" },
        });
        if (metodosPago) {
            return res.status(200).json({
                ok: true,
                msj: "",
                metodosPago,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Metodo de pago no encontrado",
            metodosPago: [],
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.obtenerMetodoDePago = obtenerMetodoDePago;

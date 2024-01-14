"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarCierreCaja = exports.obtenerCierres = void 0;
const database_1 = require("../database/database");
const cierreCajaSchemas_1 = require("../schemas/cierreCajaSchemas");
const obtenerCierres = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const cierres = await database_1.prisma.cierreCaja.findMany({
            skip: skip,
            take: pageSize,
            orderBy: { fecha: "asc" },
            include: {
                caja: true,
                deposito: true,
            },
        });
        if (cierres) {
            return res.status(200).json({
                ok: true,
                msj: "",
                cierres,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Cierre Caja no encontrada",
            cierres: [],
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.obtenerCierres = obtenerCierres;
const iniciarCierreCaja = async (req, res) => {
    try {
        const data = (0, cierreCajaSchemas_1.validarCierreCaja)(req.body);
        if (!data.success) {
            return res
                .status(422)
                .json({ ok: false, msj: JSON.parse(data.error.message) });
        }
        const { idCaja, montoCierre } = data.data;
        const existeCaja = await database_1.prisma.caja.findFirst({
            where: { id: idCaja },
            include: { cierreCaja: true },
        });
        if (!existeCaja) {
            return res.status(400).json({
                ok: false,
                msj: `El ID de caja proporcionado no existe`,
            });
        }
        if (existeCaja.cierreCaja) {
            return res.status(400).json({
                ok: false,
                msj: `La caja ya registra un cierre `,
            });
        }
        const montoActual = existeCaja.montoActual || 0;
        const diferencia = montoActual - montoCierre;
        if (montoCierre > montoActual) {
            return res.status(400).json({
                ok: false,
                msj: `No se puede cerrar la caja con un valor superior al monto actual existente en caja, por favor verifica el monto de cierre`,
                montoActual,
                diferencia,
            });
        }
        const cierreCaja = await database_1.prisma.cierreCaja.create({
            data: { idCaja, montoCierre, diferencia },
            include: { deposito: true },
        });
        await database_1.prisma.caja.update({
            where: { id: idCaja },
            data: {
                estado: false,
            },
        });
        return res.status(201).json({
            ok: true,
            msj: `Cierre de caja exitoso `,
            cierreCaja,
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.iniciarCierreCaja = iniciarCierreCaja;

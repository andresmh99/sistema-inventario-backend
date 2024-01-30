"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarCaja = exports.obtenerCajaActiva = exports.obtenerCajaPorId = exports.obtenerCajas = void 0;
const database_1 = require("../database/database");
const caja_schema_1 = require("../schemas/caja.schema");
const obtenerCajas = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const cajas = await database_1.prisma.caja.findMany({
            skip: skip,
            take: pageSize,
            orderBy: { fecha: "desc" },
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        apellido: true,
                        nombreUsuario: true,
                        email: true,
                        rol: true,
                    },
                },
                ventas: true,
                cierreCaja: true,
                deposito: true,
                _count: true,
            },
        });
        if (cajas.length > 0) {
            return res.status(200).json({
                ok: true,
                msj: "Cajas obtenidas exitosamente",
                cajas,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "No se encontraron cajas",
            cajas: [],
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha habido un error", error });
    }
};
exports.obtenerCajas = obtenerCajas;
const obtenerCajaPorId = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        const caja = await database_1.prisma.caja.findFirst({
            where: { id: id },
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        apellido: true,
                        nombreUsuario: true,
                        email: true,
                        rol: true,
                    },
                },
                ventas: true,
                _count: true,
            },
        });
        if (caja) {
            return res.status(200).json({
                ok: true,
                msj: "Caja obtenida exitosamente",
                caja,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Caja no encontrada",
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha habido un error", error });
    }
};
exports.obtenerCajaPorId = obtenerCajaPorId;
const obtenerCajaActiva = async (req, res) => {
    try {
        const caja = await database_1.prisma.caja.findFirst({
            where: { estado: true },
        });
        if (caja) {
            return res.status(200).json({
                ok: true,
                msj: "Caja activa obtenida exitosamente",
                caja,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Actualmente no existe una caja abierta. Por favor, proceda a iniciar caja antes de realizar una venta.",
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha habido un error", error });
    }
};
exports.obtenerCajaActiva = obtenerCajaActiva;
const iniciarCaja = async (req, res) => {
    try {
        const data = (0, caja_schema_1.validarCaja)(req.body);
        if (!data.success) {
            return res
                .status(422)
                .json({ ok: false, msj: "Error de validación", errors: data.error });
        }
        const { idUsuario, montoInicial } = data.data;
        const existeUsuario = await database_1.prisma.usuario.findFirst({
            where: { id: idUsuario },
        });
        if (!existeUsuario) {
            return res
                .status(400)
                .json({ ok: false, msj: `El ID de usuario proporcionado no existe` });
        }
        const cajaInfo = await database_1.prisma.caja.findFirst({
            where: { OR: [{ estado: true }, { deposito: null }] },
            include: { deposito: true },
            orderBy: { fecha: "desc" },
        });
        if (cajaInfo) {
            if (cajaInfo.estado) {
                return res
                    .status(400)
                    .json({
                    ok: false,
                    msj: `Ya existe una caja iniciada`,
                    cajas: cajaInfo,
                });
            }
            if (cajaInfo.deposito === null) {
                return res
                    .status(400)
                    .json({
                    ok: false,
                    msj: `La última caja registrada no tiene un depósito.`,
                    cajas: cajaInfo,
                });
            }
        }
        const caja = await database_1.prisma.caja.create({
            data: { idUsuario, montoInicial, montoActual: montoInicial },
        });
        return res
            .status(201)
            .json({ ok: true, msj: `Inicio de caja exitoso`, caja });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha habido un error", error });
    }
};
exports.iniciarCaja = iniciarCaja;

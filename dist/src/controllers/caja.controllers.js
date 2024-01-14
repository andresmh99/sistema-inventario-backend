"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarCaja = exports.obtenerCajas = void 0;
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
            orderBy: { fecha: "asc" },
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
        if (cajas) {
            return res.status(200).json({
                ok: true,
                msj: "",
                cajas,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Caja no encontrada",
            cajas: [],
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.obtenerCajas = obtenerCajas;
const iniciarCaja = async (req, res) => {
    try {
        const data = (0, caja_schema_1.validarCaja)(req.body);
        if (!data.success) {
            return res
                .status(422)
                .json({ ok: false, msj: JSON.parse(data.error.message) });
        }
        const { idUsuario, montoInicial } = data.data;
        const existeUsuario = await database_1.prisma.usuario.findFirst({
            where: { id: idUsuario },
        });
        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msj: `El ID de usuario proporcionado no existe`,
            });
        }
        const cajaIniciada = await database_1.prisma.caja.findMany({
            where: { estado: true },
        });
        if (cajaIniciada.length) {
            return res.status(400).json({
                ok: false,
                msj: `Ya existe una caja iniciada  `,
                cajas: cajaIniciada,
            });
        }
        const caja = await database_1.prisma.caja.create({
            data: { idUsuario, montoInicial, montoActual: montoInicial },
        });
        return res.status(201).json({
            ok: true,
            msj: `Inicio de caja exitoso `,
            caja,
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.iniciarCaja = iniciarCaja;

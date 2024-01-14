"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearDeposito = exports.obtenerDepositosCaja = void 0;
const database_1 = require("../database/database");
const deposito_schema_1 = require("../schemas/deposito.schema");
const obtenerDepositosCaja = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const depositos = await database_1.prisma.deposito.findMany({
            skip: skip,
            take: pageSize,
            orderBy: { id: "desc" },
            include: {
                cierreCaja: true,
                caja: true,
            },
        });
        if (depositos) {
            return res.status(200).json({
                ok: true,
                msj: "",
                depositos,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Deposito no encontrado",
            depositos: [],
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.obtenerDepositosCaja = obtenerDepositosCaja;
const crearDeposito = async (req, res) => {
    try {
        const data = (0, deposito_schema_1.validarDepositoCaja)(req.body);
        if (!data.success) {
            return res
                .status(422)
                .json({ ok: false, msj: JSON.parse(data.error.message) });
        }
        const { idCaja, montoDeposito, idCierreCaja } = data.data;
        const existeCaja = await database_1.prisma.caja.findFirst({
            where: { id: idCaja },
            include: { deposito: true },
        });
        if (!existeCaja) {
            return res.status(400).json({
                ok: false,
                msj: `El identificador de la caja proporcionado no se encuentra en la base de datos o no existe.`,
            });
        }
        if (existeCaja.estado) {
            return res.status(400).json({
                ok: false,
                msj: `Para realizar un depósito, es necesario cerrar la caja previamente abierta; es imperativo completar el cierre de caja antes de proceder con el depósito.`,
            });
        }
        if (existeCaja.deposito) {
            return res.status(400).json({
                ok: false,
                msj: `La caja seleccionada ya tiene un depósito registrado.`,
            });
        }
        const existeCierre = await database_1.prisma.cierreCaja.findFirst({
            where: { id: idCierreCaja },
        });
        if (!existeCierre) {
            return res.status(400).json({
                ok: false,
                msj: `El identificador del cierre de caja proporcionado no se encuentra en la base de datos o no existe.`,
            });
        }
        if (existeCierre.idCaja !== existeCaja.id) {
            return res.status(404).json({
                ok: false,
                msj: `El identificador del cierre de caja no coincide con la caja que fue cerrada anteriormente.`,
            });
        }
        const montoActualCaja = existeCaja.montoActual;
        const diferenciaCierreCaja = existeCierre.diferencia;
        const restanteCaja = montoActualCaja - montoDeposito - diferenciaCierreCaja;
        if (montoDeposito > existeCierre.montoCierre) {
            return res.status(400).json({
                ok: false,
                msj: `No es posible efectuar un depósito con un valor superior al monto de cierre de caja. Por favor, verifica la cantidad correspondiente al cierre antes de proceder.`,
                montoActualCaja,
                diferenciaCierreCaja,
                restanteCaja,
            });
        }
        const deposito = await database_1.prisma.deposito.create({
            data: { idCaja, idCierreCaja, montoDeposito, restanteCaja },
            include: { cierreCaja: true, caja: true },
        });
        return res.status(201).json({
            ok: true,
            msj: `El depósito ha sido registrado con éxito.`,
            deposito,
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.crearDeposito = crearDeposito;

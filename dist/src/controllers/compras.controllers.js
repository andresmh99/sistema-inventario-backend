"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearCompra = exports.obtenerProveedor = exports.obtenerCompras = void 0;
const database_1 = require("../database/database");
const obtenerCompras = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const compras = await database_1.prisma.compra.findMany({
            skip: skip,
            take: pageSize,
            orderBy: { fecha: "asc" },
            include: { detalleCompra: true, _count: true },
        });
        const totalCount = await database_1.prisma.compra.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const info = {
            count: totalCount,
            pages: pageCount,
        };
        if (compras) {
            return res.status(200).json({
                ok: true,
                info,
                msj: "",
                compras,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "No existen compras registradas",
            compras: [],
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ ok: false, msj: "Ha Habido un error", error });
    }
};
exports.obtenerCompras = obtenerCompras;
const obtenerProveedor = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        const proveedor = await database_1.prisma.proveedor.findUnique({ where: { id: id } });
        if (proveedor) {
            return res.status(200).json({
                ok: true,
                proveedor,
            });
        }
        return res.status(404).send({
            ok: false,
            msj: "El registro indicado no existe, por favor intente nuevamente",
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ ok: false, msj: "Ha Habido un error", error });
    }
};
exports.obtenerProveedor = obtenerProveedor;
const crearCompra = async (req, res) => {
    try {
        const data = req.body;
        if (isNaN(data.idProveedor)) {
            return res.status(500).json({
                ok: false,
                msj: "El ID del proveedor ingresado es incorrecto",
            });
        }
        else if (data.idProveedor === undefined || data.idProveedor === null) {
            data.idProveedor = 1;
        }
        // Verifica si el proveedor ya existe
        const existeProveedor = await database_1.prisma.proveedor.findUnique({
            where: { id: data.idProveedor },
        });
        if (!existeProveedor) {
            // el proveedor no existe, así que la creamos
            data.idProveedor = 1;
        }
        let montoTotal = 0;
        const compra = await database_1.prisma.compra.create({
            data: {
                proveedor: { connect: { id: data.idProveedor } },
                montoTotal: montoTotal
            },
        });
        // Iterar sobre los detalles de los productos
        for (const detalle of data.detalleCompra) {
            const { idProducto, cantidad, precioCompra } = detalle;
            // Crear el detalle de compra asociado a la compra creada anteriormente
            await database_1.prisma.detalleCompra.create({
                data: {
                    compra: { connect: { id: compra.id } },
                    producto: { connect: { id: idProducto } },
                    cantidad,
                    precioCompra: precioCompra,
                },
            });
            // Calcular el monto total sumando el precio de cada producto
            montoTotal += cantidad * precioCompra;
        }
        const resultado = await database_1.prisma.compra.update({
            where: { id: compra.id },
            data: { montoTotal },
        });
        return res.status(200).send({
            ok: true,
            msj: "La compra se ha registrado exitosamente",
            resultado
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ ok: false, msj: "Ha Habido un error", error });
    }
};
exports.crearCompra = crearCompra;

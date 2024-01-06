"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtroProveedor = exports.eliminarProveedor = exports.actualizarProveedor = exports.crearProveedor = exports.obtenerProveedor = exports.obtenerProveedores = void 0;
const database_1 = require("../database/database");
const obtenerProveedores = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const proveedores = await database_1.prisma.proveedor.findMany({
            skip: skip,
            take: pageSize,
            orderBy: { nombre: "asc" },
            include: { compras: false, _count: true },
        });
        const totalCount = await database_1.prisma.proveedor.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const info = {
            count: totalCount,
            pages: pageCount,
        };
        if (proveedores) {
            return res.status(200).json({
                ok: true,
                info,
                msj: "",
                proveedores,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "No existen proveedores registrados",
            proveedores: [],
        });
    }
    catch (error) {
        return res.status(500).json({ ok: false, msj: "Ha Habido un error", error });
    }
};
exports.obtenerProveedores = obtenerProveedores;
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
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.obtenerProveedor = obtenerProveedor;
const crearProveedor = async (req, res) => {
    try {
        const data = req.body;
        if (data.nombre === undefined ||
            data.nombre === null ||
            data.nombre === "") {
            return res.status(400).send({
                ok: false,
                msj: "El nombre del proveedor es requerido, por favor ingrese nombre",
            });
        }
        // Verifica si el proveedor ya existe
        const existeProveedor = await database_1.prisma.proveedor.findUnique({
            where: { nombre: data.nombre },
        });
        if (!existeProveedor) {
            // el proveedor no existe, así que la creamos
            const proveedor = await database_1.prisma.proveedor.create({
                data: data,
            });
            return res.status(200).send({
                ok: true,
                msj: "El proveedor se ha registrado exitosamente",
                proveedor,
            });
        }
        return res.status(403).send({
            ok: false,
            msj: "El proveedor ingresado ya existe, por favor ingrese un nombre diferente",
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.crearProveedor = crearProveedor;
const actualizarProveedor = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        const existingCategoryWithName = await database_1.prisma.proveedor.findFirst({
            where: {
                nombre: req.body.nombre,
                NOT: {
                    id: id, // Excluir el usuario actual que se está actualizando
                },
            },
        });
        if (existingCategoryWithName) {
            return res.status(403).send({
                ok: false,
                msj: "El proveedor ingresada ya existe, por favor ingrese un nombre diferente",
            });
        }
        const proveedor = await database_1.prisma.proveedor.update({
            where: { id: id },
            data: req.body,
        });
        if (proveedor) {
            return res.json({
                ok: true,
                proveedor,
            });
        }
        return res.status(403).send({
            ok: false,
            msj: "El registro indicado no existe, por favor intente nuevamente",
        });
    }
    catch (error) {
        return res.status(404).json({ msj: "No se ha encontrado registro", error });
    }
};
exports.actualizarProveedor = actualizarProveedor;
const eliminarProveedor = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        // Buscar El proveedor que se va a eliminar
        const proveedorAEliminar = await database_1.prisma.proveedor.findUnique({
            where: { id: id },
        });
        if (!proveedorAEliminar) {
            return res
                .status(404)
                .json({ ok: false, msj: "Proveedor no encontrado" });
        }
        else if (proveedorAEliminar.id === 1) {
            return res
                .status(500)
                .json({
                ok: false,
                msj: "No se puede eliminar el Proveedor por defecto",
            });
        }
        // Buscar las compras asociados a el proveedor que se eliminará
        const compras = await database_1.prisma.compra.findMany({
            where: { idProveedor: id },
        });
        // Actualizar las compras cambiando su proveedor a el proveedor predeterminada "Sin proveedor" (id = 0)
        await Promise.all(compras.map(async (compra) => {
            await database_1.prisma.compra.update({
                where: { id: compra.id },
                data: {
                    idProveedor: 1, // ID de el proveedor sin proveedor
                },
            });
        }));
        const proveedor = await database_1.prisma.proveedor.delete({ where: { id: id } });
        if (proveedor) {
            return res.status(200).json({
                ok: true,
                msj: "proveedor " + proveedor.nombre + " Eliminada exitosamente",
            });
        }
        return res.status(403).send({
            ok: false,
            msj: "No se ha podido completar la acción, por favor intente de nuevo",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.eliminarProveedor = eliminarProveedor;
const filtroProveedor = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const data = req.query["s"];
        const proveedores = await database_1.prisma.proveedor.findMany({
            where: {
                OR: [{ nombre: { startsWith: data, mode: "insensitive" } }],
            },
            skip: skip,
            take: pageSize,
            orderBy: { nombre: "asc" },
        });
        const totalCount = await database_1.prisma.proveedor.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const info = {
            count: totalCount,
            pages: pageCount,
        };
        if (proveedores.length > 0) {
            return res.status(200).json({
                ok: true,
                msj: "",
                proveedores,
                info,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Proveedor no encontrado",
            proveedores: [],
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msj: "Error al buscar Proveedor",
            error,
        });
    }
};
exports.filtroProveedor = filtroProveedor;

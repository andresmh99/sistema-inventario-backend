"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtroCategoria = exports.eliminarCategoria = exports.actualizarCategoria = exports.crearCategoria = exports.obtenerCategoria = exports.obtenerCategorias = void 0;
const database_1 = require("../database/database");
const obtenerCategorias = async (req, res) => {
    /*const page: number = Number(req.query.page) || 1;
    const pageSize: number = 10;
    const skip: number = (page - 1) * pageSize;*/
    try {
        const categorias = await database_1.prisma.categoria.findMany({
            //skip: skip,
            //take: pageSize,
            orderBy: { nombreCategoria: "asc" },
            include: { productos: false, _count: true },
        });
        if (categorias) {
            return res.status(200).json({
                ok: true,
                msj: "",
                categorias,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Categoria no encontrada",
            categorias: [],
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.obtenerCategorias = obtenerCategorias;
const obtenerCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        const categoria = await database_1.prisma.categoria.findUnique({ where: { id: id } });
        if (categoria) {
            return res.status(200).json({
                ok: true,
                categoria,
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
exports.obtenerCategoria = obtenerCategoria;
const crearCategoria = async (req, res) => {
    try {
        const data = req.body;
        if (data.nombreCategoria === undefined ||
            data.nombreCategoria === null ||
            data.nombreCategoria === "") {
            return res.status(400).send({
                ok: false,
                msj: "El nombre de la categoría es requerido, por favor ingrese nombre",
            });
        }
        // Verifica si la categoría ya existe
        const existingCategoria = await database_1.prisma.categoria.findUnique({
            where: { nombreCategoria: data.nombreCategoria },
        });
        if (!existingCategoria) {
            // La categoría no existe, así que la creamos
            const categoria = await database_1.prisma.categoria.create({
                data: data,
            });
            return res.status(200).send({
                ok: true,
                msj: "La categoría se ha registrado exitosamente",
                categoria,
            });
        }
        return res.status(403).send({
            ok: false,
            msj: "La categoría ingresada ya existe, por favor ingrese un nombre diferente",
        });
    }
    catch (error) {
        return res.status(500).json({ msj: "Ha Habido un error", error });
    }
};
exports.crearCategoria = crearCategoria;
const actualizarCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        const existingCategoryWithName = await database_1.prisma.categoria.findFirst({
            where: {
                nombreCategoria: req.body.nombreCategoria,
                NOT: {
                    id: id, // Excluir el usuario actual que se está actualizando
                },
            },
        });
        if (existingCategoryWithName) {
            return res.status(403).send({
                ok: false,
                msj: "La categoría ingresada ya existe, por favor ingrese un nombre diferente",
            });
        }
        const categoria = await database_1.prisma.categoria.update({
            where: { id: id },
            data: req.body,
        });
        if (categoria) {
            return res.json({
                ok: true,
                categoria,
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
exports.actualizarCategoria = actualizarCategoria;
const eliminarCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        // Buscar la categoría que se va a eliminar
        const categoriaAEliminar = await database_1.prisma.categoria.findUnique({
            where: { id: id },
        });
        if (!categoriaAEliminar) {
            return res
                .status(404)
                .json({ ok: false, msj: "Categoría no encontrada" });
        }
        else if (categoriaAEliminar.id === 1) {
            return res
                .status(500)
                .json({
                ok: false,
                msj: "No se puede eliminar la categoría por defecto",
            });
        }
        // Buscar los productos asociados a la categoría que se eliminará
        const productos = await database_1.prisma.producto.findMany({
            where: { idCategoria: id },
        });
        // Actualizar los productos cambiando su categoría a la categoría predeterminada sin categoría (id = 0)
        await Promise.all(productos.map(async (producto) => {
            await database_1.prisma.producto.update({
                where: { id: producto.id },
                data: {
                    idCategoria: 1, // ID de la categoría sin categoría
                },
            });
        }));
        const categoria = await database_1.prisma.categoria.delete({ where: { id: id } });
        if (categoria) {
            return res.status(200).json({
                ok: true,
                msj: "Categoria " + categoria.nombreCategoria + " Eliminada exitosamente",
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
exports.eliminarCategoria = eliminarCategoria;
const filtroCategoria = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const data = req.query["s"];
        const categorias = await database_1.prisma.categoria.findMany({
            where: {
                OR: [{ nombreCategoria: { startsWith: data, mode: "insensitive" } }],
            },
            skip: skip,
            take: pageSize,
            orderBy: { nombreCategoria: "asc" },
        });
        const totalCount = await database_1.prisma.categoria.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const info = {
            count: totalCount,
            pages: pageCount,
        };
        if (categorias.length > 0) {
            return res.status(200).json({
                ok: true,
                msj: "",
                categorias,
                info,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Categoria no encontrada",
            categorias: [],
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msj: "Error al buscar categoria",
            error,
        });
    }
};
exports.filtroCategoria = filtroCategoria;

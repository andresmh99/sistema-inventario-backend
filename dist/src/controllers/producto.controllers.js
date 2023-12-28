"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtroProducto = exports.actualizarStock = exports.eliminarProducto = exports.actualizarImagen = exports.actualizarProducto = exports.crearProducto = exports.obtenerProductoPorId = exports.obtenerProductos = void 0;
const database_1 = require("../database/database");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const validacionesProducto_1 = require("../middlewares/validacionesProducto");
const obtenerProductos = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const productos = await database_1.prisma.producto.findMany({
            include: { categoria: true },
            skip: skip,
            take: pageSize,
            orderBy: { nombreProducto: "asc" },
        });
        const totalCount = await database_1.prisma.producto.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const info = {
            count: totalCount,
            pages: pageCount,
        };
        return res.json({
            ok: true,
            info,
            productos,
            skip,
        });
    }
    catch (error) {
        res.status(500).json({ msj: "Error en el servidor", error });
    }
};
exports.obtenerProductos = obtenerProductos;
const obtenerProductoPorId = async (req, res) => {
    const id = parseInt(req.params["id"]);
    try {
        const producto = await database_1.prisma.producto.findFirst({
            where: { id: id },
            include: { categoria: true },
        });
        if (producto) {
            return res.json({
                ok: true,
                msj: "",
                producto,
            });
        }
        return res.status(404).send({
            ok: false,
            msj: "El registro indicado no existe, por favor intente nuevamente",
        });
    }
    catch (error) {
        res.status(500).json({ msj: "Error en el servidor", error });
    }
};
exports.obtenerProductoPorId = obtenerProductoPorId;
const crearProducto = async (req, res) => {
    var _a, _b;
    try {
        const data = {
            nombreProducto: req.body.nombreProducto,
            descripcion: req.body.descripcion,
            sku: req.body.sku,
            precioVenta: parseFloat(req.body.precioVenta),
            precioCompra: parseFloat(req.body.precioCompra),
            marca: req.body.marca,
            stock: parseInt(req.body.stock),
            imagen: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
            idCategoria: parseInt(req.body.categoria),
        };
        const producto = await database_1.prisma.producto.create({ data });
        if (!producto) {
            (0, validacionesProducto_1.eliminarImagen)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
            return res.status(500).json({
                ok: false,
                msj: "El producto no pudo ser registrado. Por favor, intente nuevamente.",
            });
        }
        return res.status(201).json({
            ok: true,
            producto,
            msj: "El producto ha sido registrado exitosamente.",
        });
    }
    catch (error) {
        res.status(500).json({ msj: "Error en el servidor", error });
    }
};
exports.crearProducto = crearProducto;
const actualizarProducto = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        // Filtra solo los campos que tienen valores en req.body
        const data = {};
        if (req.body.nombreProducto)
            data.nombreProducto = req.body.nombreProducto;
        if (req.body.descripcion)
            data.descripcion = req.body.descripcion;
        if (req.body.sku)
            data.sku = req.body.sku;
        if (!isNaN(parseFloat(req.body.precioVenta)))
            data.precioVenta = parseFloat(req.body.precioVenta);
        if (!isNaN(parseFloat(req.body.precioCompra)))
            data.precioCompra = parseFloat(req.body.precioCompra);
        if (req.body.marca)
            data.marca = req.body.marca;
        if (!isNaN(parseInt(req.body.stock)))
            data.stock = parseInt(req.body.stock);
        const producto = await database_1.prisma.producto.update({
            where: { id: id },
            data: data,
        });
        if (producto) {
            return res.json({
                ok: true,
                producto,
                msj: "El producto actualizado exitosamente",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(403).send({
            ok: false,
            msj: "Error en el servidor",
            error,
        });
    }
};
exports.actualizarProducto = actualizarProducto;
const actualizarImagen = async (req, res) => {
    var _a;
    try {
        const id = parseInt(req.params["id"]);
        const imagen = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const exists = await database_1.prisma.producto.findFirst({ where: { id: id } });
        if (exists === null || exists === void 0 ? void 0 : exists.imagen) {
            const imagePath = path_1.default.resolve("./" + (exists === null || exists === void 0 ? void 0 : exists.imagen));
            if (fs_extra_1.default.existsSync(imagePath)) {
                await fs_extra_1.default.unlink(imagePath);
            }
        }
        const producto = await database_1.prisma.producto.update({
            where: { id: id },
            data: { imagen: imagen },
        });
        if (producto) {
            return res.status(200).json({
                ok: true,
                producto,
                msj: "El producto actualizado exitosamente",
            });
        }
    }
    catch (error) {
        return res.status(500).send({
            ok: false,
            msj: "Error en el servidor",
            error,
        });
    }
};
exports.actualizarImagen = actualizarImagen;
const eliminarProducto = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        const producto = await database_1.prisma.producto.delete({
            where: { id: id },
        });
        if (producto) {
            /*console.log(producto.imagen);
            if (producto.imagen) {
              await fs.unlink(path.resolve(producto.imagen));
            }*/
            return res.status(200).json({
                ok: true,
                msj: "Producto " + producto.nombreProducto + " Eliminado exitosamente",
            });
        }
        return res.status(400).send({
            ok: false,
            msj: "No se ha podido completar la acción, por favor intente de nuevo",
        });
    }
    catch (error) {
        return res.status(500).json({
            msj: "No se ha podido completar la acción, por favor intente de nuevo",
            error,
        });
    }
};
exports.eliminarProducto = eliminarProducto;
const actualizarStock = async (req, res) => {
    const id = parseInt(req.params.id);
    const stockToAdd = parseInt(req.body.stock);
    try {
        const producto = await database_1.prisma.producto.findFirst({ where: { id: id } });
        if (producto) {
            const stockActual = producto.stock || 0; // Si el stock es null o undefined, establece 0
            const nuevoStock = stockActual + stockToAdd;
            const productoActualizado = await database_1.prisma.producto.update({
                where: { id: id },
                data: { stock: nuevoStock },
            });
            return res.status(200).json({
                ok: true,
                producto: productoActualizado,
                msj: "Registro actualizado exitosamente",
            });
        }
        return res.status(404).send({
            ok: false,
            msj: "El registro indicado no existe, por favor intente nuevamente",
        });
    }
    catch (error) {
        return res.status(500).send({
            ok: false,
            msj: "Error en el servidor",
            error,
        });
    }
};
exports.actualizarStock = actualizarStock;
const filtroProducto = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const data = req.query["s"];
        const productos = await database_1.prisma.producto.findMany({
            where: {
                OR: [
                    { nombreProducto: { startsWith: data, mode: "insensitive" } },
                    { marca: { startsWith: data, mode: "insensitive" } },
                    { sku: { startsWith: data, mode: "insensitive" } },
                ],
            },
            include: {
                categoria: true, // Ajusta según la relación en tu modelo
            },
            skip: skip,
            take: pageSize,
            orderBy: { nombreProducto: "asc" },
        });
        const totalCount = await database_1.prisma.producto.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const info = {
            count: totalCount,
            pages: pageCount,
        };
        if (productos.length > 0) {
            return res.status(200).json({
                ok: true,
                msj: "",
                productos,
                info,
            });
        }
        return res.status(404).json({
            ok: false,
            msj: "Producto no encontrado",
            productos: [],
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msj: "Error al buscar productos",
            error,
        });
    }
};
exports.filtroProducto = filtroProducto;

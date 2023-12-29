"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCampoUnicoEnBDActualizar = exports.validarCamposRequeridos = exports.validarCampoUnicoEnBD = exports.validarCamposNumericos = exports.eliminarImagen = void 0;
const database_1 = require("../database/database");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const eliminarImagen = async (rutaImagen) => {
    if (rutaImagen) {
        const imagePath = path_1.default.resolve("./" + rutaImagen);
        if (fs_extra_1.default.existsSync(imagePath)) {
            await fs_extra_1.default.unlink(imagePath);
        }
    }
};
exports.eliminarImagen = eliminarImagen;
const validarCamposNumericos = async (req, res, next) => {
    var _a;
    const errores = [];
    const campos = [
        { stock: req.body.stock },
        { precioVenta: req.body.precioVenta },
        { precioCompra: req.body.precioCompra },
    ];
    for (let i = 0; i < campos.length; i++) {
        const valor = Object.values(campos[i])[0]; // Extrae el valor del objeto
        if (!valor) {
            errores.push(`El campo ${Object.keys(campos[i])[0]} es requerido.`);
        }
        if (isNaN(valor)) {
            errores.push(`El campo ${Object.keys(campos[i])[0]} debe ser numérico.`);
        }
    }
    if (errores.length > 0) {
        (0, exports.eliminarImagen)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        return res.status(400).json({ ok: false, errores });
    }
    next();
};
exports.validarCamposNumericos = validarCamposNumericos;
const validarCampoUnicoEnBD = async (req, res, next) => {
    var _a, _b, _c;
    const data = {
        nombreProducto: req.body.nombreProducto,
        sku: req.body.sku,
    };
    const existePorNombre = await database_1.prisma.producto.findFirst({
        where: {
            nombreProducto: data.nombreProducto,
        },
    });
    const existePorSku = await database_1.prisma.producto.findFirst({
        where: { sku: data.sku },
    });
    if (existePorNombre && existePorSku) {
        (0, exports.eliminarImagen)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        return res.status(409).json({
            ok: false,
            msj: `El Nombre del Producto y SKU ya se encuentran registrados, intenta con otros valores.`,
        });
    }
    if (existePorNombre) {
        (0, exports.eliminarImagen)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        return res.status(409).json({
            ok: false,
            msj: `El Nombre del Producto ingresado ya se encuentra registrado, intenta con otro valor.`,
        });
    }
    if (existePorSku) {
        (0, exports.eliminarImagen)((_c = req.file) === null || _c === void 0 ? void 0 : _c.path);
        return res.status(409).json({
            ok: false,
            msj: `El SKU ingresado ya se encuentra registrado, intenta con otro valor.`,
        });
    }
    next();
};
exports.validarCampoUnicoEnBD = validarCampoUnicoEnBD;
const validarCamposRequeridos = async (req, res, next) => {
    var _a, _b;
    const camposRequeridos = {
        nombreProducto: "Nombre del Producto",
        sku: "SKU",
        marca: "Marca",
    };
    const camposFaltantes = [];
    for (const campo in camposRequeridos) {
        const valor = req.body[campo];
        if (valor === undefined ||
            valor === null ||
            (typeof valor === "string" && valor.trim() === "")) {
            camposFaltantes.push(camposRequeridos[campo]);
        }
    }
    if (camposFaltantes.length > 0) {
        (0, exports.eliminarImagen)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        return res.status(400).json({
            ok: false,
            msj: `Los siguientes campos son requeridos y no pueden estar vacíos: ${camposFaltantes.join(", ")}.`,
        });
    }
    // Validar que el ID de la categoría exista en la base de datos
    const idCategoria = req.body.categoria ? parseInt(req.body.categoria) : 1;
    const categoriaExistente = await database_1.prisma.categoria.findUnique({
        where: { id: idCategoria },
    });
    if (!categoriaExistente) {
        (0, exports.eliminarImagen)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        return res.status(400).json({
            ok: false,
            msj: "El ID de la categoría proporcionado no es válido o no existe en la base de datos.",
        });
    }
    next();
};
exports.validarCamposRequeridos = validarCamposRequeridos;
const validarCampoUnicoEnBDActualizar = async (req, res, next) => {
    var _a, _b;
    const data = {
        id: parseInt(req.params.id),
        nombreProducto: req.body.nombreProducto,
        sku: req.body.sku,
    };
    try {
        console.log(req.body);
        console.log(data);
        const existePorNombre = await database_1.prisma.producto.findFirst({
            where: {
                nombreProducto: data.nombreProducto,
                NOT: { id: data.id },
            },
        });
        const existePorSku = await database_1.prisma.producto.findFirst({
            where: { sku: data.sku, NOT: { id: data.id } },
        });
        console.log(existePorNombre);
        console.log(existePorSku);
        if (existePorNombre) {
            (0, exports.eliminarImagen)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
            return res.status(409).json({
                ok: false,
                msj: `El Nombre del Producto ingresado ya se encuentra registrado, intenta con otro valor.`,
            });
        }
        if (existePorSku) {
            (0, exports.eliminarImagen)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
            return res.status(409).json({
                ok: false,
                msj: `El SKU ingresado ya se encuentra registrado, intenta con otro valor.`,
            });
        }
    }
    catch (error) {
        return res.status(403).send({
            ok: false,
            msj: "Error en el servidor",
            error,
        });
    }
    next();
};
exports.validarCampoUnicoEnBDActualizar = validarCampoUnicoEnBDActualizar;

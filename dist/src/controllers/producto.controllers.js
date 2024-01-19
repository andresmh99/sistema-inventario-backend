"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtroProducto = exports.actualizarStock = exports.eliminarProducto = exports.actualizarProducto = exports.crearProducto = exports.obtenerProductoPorId = exports.obtenerProductos = void 0;
const database_1 = require("../database/database");
const validacionesProducto_1 = require("../middlewares/validacionesProducto");
const cloudinary_1 = require("../libs/cloudinary");
const producto_schema_1 = require("../schemas/producto.schema");
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
        return res.status(200).json({
            ok: true,
            info,
            productos,
            skip,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ ok: false, msj: "Error en el servidor", error });
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
    var _a;
    try {
        const { body, files } = req;
        // Convertir propiedades a números si son cadenas
        const propiedadesNumericas = [
            "precioCompra",
            "precioVenta",
            "stock",
            "idCategoria",
        ];
        propiedadesNumericas.forEach((prop) => {
            if (prop === "idCategoria" && body[prop] === undefined) {
                body[prop] = 1;
            }
            if (typeof body[prop] === "string") {
                body[prop] = parseInt(body[prop]);
            }
        });
        const datosValidados = (0, producto_schema_1.validarProducto)(body);
        if (!datosValidados.success) {
            const file = files === null || files === void 0 ? void 0 : files.imagen;
            (0, validacionesProducto_1.eliminarImagen)(file === null || file === void 0 ? void 0 : file.tempFilePath);
            return res
                .status(422)
                .json({ ok: false, msj: JSON.parse(datosValidados.error.message) });
        }
        const data = datosValidados.data;
        if (files === null || files === void 0 ? void 0 : files.imagen) {
            const file = files.imagen;
            const result = await (0, cloudinary_1.uploadsImage)(file.tempFilePath);
            data.public_image_id = result.public_id;
            data.secure_image_url = result.secure_url;
            if (file) {
                (0, validacionesProducto_1.eliminarImagen)(file.tempFilePath);
            }
        }
        else {
            data.secure_image_url =
                "https://res.cloudinary.com/dkwb24r3o/image/upload/v1704253293/sistema-Inventario/oth8x2gyqltcr2sxbrxb.png";
        }
        const producto = await database_1.prisma.producto.create({
            data,
            include: { categoria: true },
        });
        if (!producto) {
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
        const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.imagen;
        (0, validacionesProducto_1.eliminarImagen)(file === null || file === void 0 ? void 0 : file.tempFilePath);
        res.status(500).json({ msj: "Error en el servidor", error });
    }
};
exports.crearProducto = crearProducto;
const actualizarProducto = async (req, res) => {
    var _a;
    try {
        const { params, body, files } = req;
        params.id = parseInt(params.id);
        // Convertir propiedades a números si son cadenas
        ["precioCompra", "precioVenta", "stock", "idCategoria"].forEach((prop) => {
            if (typeof body[prop] === "string") {
                body[prop] = parseInt(body[prop]);
            }
        });
        const datosValidados = (0, producto_schema_1.validarProductoParcial)({ params, body });
        if (!datosValidados.success) {
            const file = files === null || files === void 0 ? void 0 : files.imagen;
            (0, validacionesProducto_1.eliminarImagen)(file.tempFilePath);
            return res
                .status(422)
                .json({ ok: false, msj: JSON.parse(datosValidados.error.message) });
        }
        const { data: { body: dataBody, params: dataParams }, } = datosValidados;
        if (dataParams && dataBody) {
            const producto = await database_1.prisma.producto.findFirst({
                where: { id: dataParams.id },
            });
            if (!producto) {
                return res
                    .status(404)
                    .json({ ok: false, msj: "Producto no encontrado" });
            }
            let secure_image_url = dataBody.secure_image_url;
            if (files === null || files === void 0 ? void 0 : files.imagen) {
                const file = files === null || files === void 0 ? void 0 : files.imagen;
                const result = await (0, cloudinary_1.uploadsImage)(file.tempFilePath);
                dataBody.public_image_id = result.public_id;
                dataBody.secure_image_url = result.secure_url;
                if (producto.public_image_id) {
                    await (0, cloudinary_1.deleteImage)(producto.public_image_id);
                }
                if (file) {
                    (0, validacionesProducto_1.eliminarImagen)(file.tempFilePath);
                }
            }
            else {
                secure_image_url =
                    "https://res.cloudinary.com/dkwb24r3o/image/upload/v1704253293/sistema-Inventario/oth8x2gyqltcr2sxbrxb.png";
            }
            const productoActualizado = await database_1.prisma.producto.update({
                where: { id: dataParams.id },
                data: dataBody,
            });
            if (productoActualizado) {
                return res.json({
                    ok: true,
                    producto: productoActualizado,
                    msj: "El producto actualizado exitosamente",
                });
            }
        }
    }
    catch (error) {
        const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.imagen;
        (0, validacionesProducto_1.eliminarImagen)(file === null || file === void 0 ? void 0 : file.tempFilePath);
        return res
            .status(403)
            .send({ ok: false, msj: "Error en el servidor", error });
    }
};
exports.actualizarProducto = actualizarProducto;
/*export const actualizarImagen = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"]);
    const imagen = req.file?.path;

    const exists = await prisma.producto.findFirst({ where: { id: id } });
    if (exists?.imagen) {
      const imagePath = path.resolve("./" + exists?.imagen);
      if (fs.existsSync(imagePath)) {
        await fs.unlink(imagePath);
      }
    }
    const producto = await prisma.producto.update({
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
  } catch (error) {
    return res.status(500).send({
      ok: false,
      msj: "Error en el servidor",
      error,
    });
  }
};*/
const eliminarProducto = async (req, res) => {
    try {
        const id = parseInt(req.params["id"]);
        const producto = await database_1.prisma.producto.delete({
            where: { id: id },
        });
        if (producto) {
            if (producto.public_image_id) {
                await (0, cloudinary_1.deleteImage)(producto.public_image_id);
            }
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

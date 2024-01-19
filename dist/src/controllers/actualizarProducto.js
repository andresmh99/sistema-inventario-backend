"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarProducto = void 0;
const database_1 = require("../database/database");
const validacionesProducto_1 = require("../middlewares/validacionesProducto");
const cloudinary_1 = require("../libs/cloudinary");
const producto_schema_1 = require("../schemas/producto.schema");
const actualizarProducto = async (req, res) => {
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
            let public_image_id = dataBody.public_image_id;
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
        return res
            .status(403)
            .send({ ok: false, msj: "Error en el servidor", error });
    }
};
exports.actualizarProducto = actualizarProducto;

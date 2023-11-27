"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../libs/multer"));
const producto_controllers_1 = require("../controllers/producto.controllers");
const validacionesProducto_1 = require("../middlewares/validacionesProducto");
const router = (0, express_1.Router)();
router.get("/productos", producto_controllers_1.obtenerProductos);
router.get("/productos/buscar", producto_controllers_1.filtroProducto);
router.get("/productos/:id", producto_controllers_1.obtenerProductoPorId);
router.post("/productos", [
    multer_1.default.single("imagen"),
    validacionesProducto_1.validarCamposRequeridos,
    validacionesProducto_1.validarCampoUnicoEnBD,
    validacionesProducto_1.validarCamposNumericos,
], producto_controllers_1.crearProducto);
router.put("/productos/:id", [validacionesProducto_1.validarCampoUnicoEnBDActualizar], producto_controllers_1.actualizarProducto);
router.delete("/productos/:id", producto_controllers_1.eliminarProducto);
router.put("/productos/actualizarStock/:id", producto_controllers_1.actualizarStock);
router.put("/productos/actualizarImagen/:id", [multer_1.default.single("imagen")], producto_controllers_1.actualizarImagen);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import multer from "../libs/multer";
const producto_controllers_1 = require("../controllers/producto.controllers");
const validacionesProducto_1 = require("../middlewares/validacionesProducto");
const middlewares_1 = require("../middlewares");
const fileUploads_1 = __importDefault(require("../libs/fileUploads"));
const router = (0, express_1.Router)();
router.get("/productos", producto_controllers_1.obtenerProductos);
router.get("/productos/buscar", [middlewares_1.authJwt.TokenValidation], producto_controllers_1.filtroProducto);
router.get("/productos/:id", [middlewares_1.authJwt.TokenValidation], producto_controllers_1.obtenerProductoPorId);
router.post("/productos", [
    fileUploads_1.default,
    middlewares_1.authJwt.TokenValidation,
    validacionesProducto_1.validarCamposRequeridos,
    validacionesProducto_1.validarCampoUnicoEnBD,
    validacionesProducto_1.validarCamposNumericos,
], producto_controllers_1.crearProducto);
router.put("/productos/:id", [middlewares_1.authJwt.TokenValidation, validacionesProducto_1.validarCampoUnicoEnBDActualizar], producto_controllers_1.actualizarProducto);
router.delete("/productos/:id", [middlewares_1.authJwt.TokenValidation], producto_controllers_1.eliminarProducto);
router.put("/productos/actualizarStock/:id", [middlewares_1.authJwt.TokenValidation], producto_controllers_1.actualizarStock);
router.put("/productos/actualizarImagen/:id", [middlewares_1.authJwt.TokenValidation]);
exports.default = router;

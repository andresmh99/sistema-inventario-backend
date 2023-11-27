"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoria_controllers_1 = require("../controllers/categoria.controllers");
const router = (0, express_1.Router)();
router.post('/categoria', categoria_controllers_1.crearCategoria);
router.get('/categoria', categoria_controllers_1.obtenerCategorias);
router.get('/categoria/:id', categoria_controllers_1.obtenerCategoria);
router.put('/categoria/:id', categoria_controllers_1.actualizarCategoria);
router.delete('/categoria/:id', categoria_controllers_1.eliminarCategoria);
exports.default = router;

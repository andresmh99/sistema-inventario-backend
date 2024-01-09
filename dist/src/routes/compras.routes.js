"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compras_controllers_1 = require("../controllers/compras.controllers");
const router = (0, express_1.Router)();
router.post('/compras', compras_controllers_1.crearCompra);
router.get('/compras', compras_controllers_1.obtenerCompras);
exports.default = router;

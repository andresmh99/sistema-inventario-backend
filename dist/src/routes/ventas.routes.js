"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const venta_controllers_1 = require("../controllers/venta.controllers");
const router = (0, express_1.Router)();
router.post('/ventas', venta_controllers_1.crearVenta);
router.get('/ventas', venta_controllers_1.obtenerVentas);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metodoPago_controlle_1 = require("../controllers/metodoPago.controlle");
const router = (0, express_1.Router)();
router.get('/metodopago', metodoPago_controlle_1.obtenerMetodoDePago);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caja_controlles_1 = require("../controllers/caja.controlles");
const router = (0, express_1.Router)();
router.post('/caja', caja_controlles_1.iniciarCaja);
router.get('/caja', caja_controlles_1.obtenerCajas);
exports.default = router;

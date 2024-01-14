"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caja_controllers_1 = require("../controllers/caja.controllers");
const router = (0, express_1.Router)();
router.post('/caja', caja_controllers_1.iniciarCaja);
router.get('/caja', caja_controllers_1.obtenerCajas);
exports.default = router;

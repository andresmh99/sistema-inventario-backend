"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cierreCaja_controllers_1 = require("../controllers/cierreCaja.controllers");
const router = (0, express_1.Router)();
router.post('/cierrecaja', cierreCaja_controllers_1.iniciarCierreCaja);
router.get('/cierrecaja', cierreCaja_controllers_1.obtenerCierres);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const depositos_controlles_1 = require("../controllers/depositos.controlles");
const router = (0, express_1.Router)();
router.post('/depositos', depositos_controlles_1.crearDeposito);
router.get('/depositos', depositos_controlles_1.obtenerDepositosCaja);
exports.default = router;

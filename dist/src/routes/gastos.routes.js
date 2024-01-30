"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gastos_controllers_1 = require("../controllers/gastos.controllers");
const router = (0, express_1.Router)();
router.post("/gastos", gastos_controllers_1.crearGasto);
router.get("/gastos", gastos_controllers_1.obtenerGastos);
router.get("/gastos/:id", gastos_controllers_1.obtenerGasto);
exports.default = router;

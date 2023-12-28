"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_controlles_1 = require("../controllers/rol.controlles");
const router = (0, express_1.Router)();
router.get("/rol", rol_controlles_1.obtenerRoles);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_controllers_1 = require("../controllers/usuarios.controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
router.get("/usuarios", usuarios_controllers_1.obtenerUsuarios);
router.get("/usuarios/buscar", [middlewares_1.authJwt.TokenValidation], usuarios_controllers_1.filtroUsuario);
router.get("/usuarios/:id", usuarios_controllers_1.obtenerUsuario);
router.post("/usuarios", usuarios_controllers_1.crearUsuario);
router.delete("/usuarios/:id", usuarios_controllers_1.eliminarUsuario);
router.put("/usuarios/:id", usuarios_controllers_1.actualizarUsuario);
exports.default = router;

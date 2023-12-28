import { Router } from "express";
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  filtroUsuario,
} from "../controllers/usuarios.controllers";
import { authJwt } from "../middlewares";

const router: Router = Router();

router.get("/usuarios", obtenerUsuarios);
router.get("/usuarios/buscar", [authJwt.TokenValidation], filtroUsuario);
router.get("/usuarios/:id", obtenerUsuario);
router.post("/usuarios", crearUsuario);
router.delete("/usuarios/:id", eliminarUsuario);
router.put("/usuarios/:id", actualizarUsuario);

export default router;

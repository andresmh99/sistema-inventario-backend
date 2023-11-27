import { Router } from "express";
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  getUsuarios,
  obtenerUsuario,
} from "../controllers/usuarios.controllers";

const router: Router = Router();

router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", obtenerUsuario);
router.post("/usuarios", crearUsuario);
router.delete("/usuarios/:id", eliminarUsuario);
router.put("/usuarios/:id", actualizarUsuario);

export default router;

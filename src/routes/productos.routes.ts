import { Router } from "express";
import multer from "../libs/multer";
import {
  actualizarImagen,
  actualizarProducto,
  actualizarStock,
  crearProducto,
  eliminarProducto,
  filtroProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from "../controllers/producto.controllers";
import {
  validarCampoUnicoEnBD,
  validarCampoUnicoEnBDActualizar,
  validarCamposNumericos,
  validarCamposRequeridos,
} from "../middlewares/validacionesProducto";

const router: Router = Router();

router.get("/productos", obtenerProductos);
router.get("/productos/buscar", filtroProducto);
router.get("/productos/:id", obtenerProductoPorId);
router.post(
  "/productos",
  [
    multer.single("imagen"),
    validarCamposRequeridos,
    validarCampoUnicoEnBD,
    validarCamposNumericos,
  ],
  crearProducto
);
router.put(
  "/productos/:id",
  [validarCampoUnicoEnBDActualizar],
  actualizarProducto
);
router.delete("/productos/:id", eliminarProducto);
router.put("/productos/actualizarStock/:id", actualizarStock);
router.put(
  "/productos/actualizarImagen/:id",
  [multer.single("imagen")],
  actualizarImagen
);

export default router;

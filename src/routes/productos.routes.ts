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
import { authJwt } from "../middlewares";

const router: Router = Router();

router.get("/productos",[authJwt.TokenValidation], obtenerProductos);
router.get("/productos/buscar",[authJwt.TokenValidation], filtroProducto);
router.get("/productos/:id",[authJwt.TokenValidation], obtenerProductoPorId);
router.post(
  "/productos",
  [
    multer.single("imagen"),
    authJwt.TokenValidation,
    validarCamposRequeridos,
    validarCampoUnicoEnBD,
    validarCamposNumericos,
  ],
  crearProducto
);
router.put(
  "/productos/:id",
  [authJwt.TokenValidation,validarCampoUnicoEnBDActualizar],
  actualizarProducto
);
router.delete("/productos/:id" , [authJwt.TokenValidation],eliminarProducto);
router.put("/productos/actualizarStock/:id",[authJwt.TokenValidation], actualizarStock);
router.put(
  "/productos/actualizarImagen/:id",
  [multer.single("imagen"), authJwt.TokenValidation],
  actualizarImagen
);

export default router;

import { Router } from "express";
//import multer from "../libs/multer";
import {
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
import fileUpload from '../libs/fileUploads'
;


const router: Router = Router();

router.get("/productos", [authJwt.TokenValidation], obtenerProductos);
router.get("/productos/buscar", [authJwt.TokenValidation], filtroProducto);
router.get("/productos/:id", [authJwt.TokenValidation], obtenerProductoPorId);
router.post(
  "/productos",
  [
    fileUpload,
    authJwt.TokenValidation,
    validarCamposRequeridos,
    validarCampoUnicoEnBD,
    validarCamposNumericos,
  ],
  crearProducto
);
router.put(
  "/productos/:id",
  [authJwt.TokenValidation, validarCampoUnicoEnBDActualizar],
  actualizarProducto
);
router.delete("/productos/:id", [authJwt.TokenValidation], eliminarProducto);
router.put(
  "/productos/actualizarStock/:id",
  [authJwt.TokenValidation],
  actualizarStock
);
router.put(
  "/productos/actualizarImagen/:id",
  [ authJwt.TokenValidation],
);

export default router;

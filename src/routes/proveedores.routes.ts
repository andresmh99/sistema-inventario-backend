import { Router } from "express";
import { authJwt } from "../middlewares";
import { actualizarProveedor, crearProveedor, eliminarProveedor, filtroProveedor, obtenerProveedor, obtenerProveedores } from "../controllers/proveedor.controller";

const router: Router = Router();

router.post('/proveedor',crearProveedor );
router.get('/proveedor',obtenerProveedores);
router.get("/proveedor/buscar", [authJwt.TokenValidation], filtroProveedor);
router.get('/proveedor/:id', obtenerProveedor);
router.put('/proveedor/:id',actualizarProveedor);
router.delete('/proveedor/:id', eliminarProveedor);

export default router;
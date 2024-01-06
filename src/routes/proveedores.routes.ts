import { Router } from "express";
import { authJwt } from "../middlewares";
import { actualizarProveedor, crearProveedor, eliminarProveedor, filtroProveedor, obtenerProveedor, obtenerProveedores } from "../controllers/proveedor.controller";

const router: Router = Router();

router.post('/proveedores',crearProveedor );
router.get('/proveedores',obtenerProveedores);
router.get("/proveedores/buscar", [authJwt.TokenValidation], filtroProveedor);
router.get('/proveedores/:id', obtenerProveedor);
router.put('/proveedores/:id',actualizarProveedor);
router.delete('/proveedores/:id', eliminarProveedor);

export default router;
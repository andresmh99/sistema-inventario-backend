import { Router } from "express";
import { actualizarCategoria, crearCategoria, eliminarCategoria, filtroCategoria, obtenerCategoria, obtenerCategorias } from "../controllers/categoria.controllers";
import { authJwt } from "../middlewares";

const router: Router = Router();

router.post('/categoria',crearCategoria );
router.get('/categoria',obtenerCategorias);
router.get("/categoria/buscar", [authJwt.TokenValidation], filtroCategoria);
router.get('/categoria/:id', obtenerCategoria);
router.put('/categoria/:id',actualizarCategoria);
router.delete('/categoria/:id', eliminarCategoria);

export default router;
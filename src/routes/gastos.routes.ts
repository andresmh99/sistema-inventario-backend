import { Router } from "express";
import { authJwt } from "../middlewares";
import { crearGasto, obtenerGasto, obtenerGastos } from "../controllers/gastos.controllers";

const router: Router = Router();

router.post("/gastos", crearGasto);
router.get("/gastos", obtenerGastos);
router.get("/gastos/:id", obtenerGasto);

export default router;

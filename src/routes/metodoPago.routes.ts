import { Router } from "express";
import { authJwt } from "../middlewares";
import { obtenerMetodoDePago } from "../controllers/metodoPago.controlle";

const router: Router = Router();

router.get('/metodopago',obtenerMetodoDePago);

export default router;
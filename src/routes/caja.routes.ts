import { Router } from "express";
import { authJwt } from "../middlewares";
import { iniciarCaja, obtenerCajaActiva, obtenerCajas } from "../controllers/caja.controllers";

const router: Router = Router();

router.post('/caja',iniciarCaja );
router.get('/caja',obtenerCajas);
router.get('/cajaActiva',obtenerCajaActiva);

export default router;
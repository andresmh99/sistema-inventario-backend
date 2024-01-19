import { Router } from "express";
import { authJwt } from "../middlewares";
import { iniciarCaja, obtenerCajaActiva, obtenerCajaPorId, obtenerCajas } from "../controllers/caja.controllers";

const router: Router = Router();

router.post('/caja',iniciarCaja );
router.get('/caja',obtenerCajas);
router.get('/caja/:id',obtenerCajaPorId);
router.get('/cajaActiva',obtenerCajaActiva);

export default router;
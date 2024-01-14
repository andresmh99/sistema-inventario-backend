import { Router } from "express";
import { authJwt } from "../middlewares";
import { iniciarCaja, obtenerCajas } from "../controllers/caja.controlles";

const router: Router = Router();

router.post('/caja',iniciarCaja );
router.get('/caja',obtenerCajas);

export default router;
import { Router } from "express";
import { authJwt } from "../middlewares";
import { iniciarCierreCaja, obtenerCierres } from "../controllers/cierreCaja.controllers";

const router: Router = Router();

router.post('/cierrecaja',iniciarCierreCaja );
router.get('/cierrecaja',obtenerCierres);

export default router;
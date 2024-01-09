import { Router } from "express";
import { authJwt } from "../middlewares";
import { crearMontoVenta } from "../controllers/venta.controllers";

const router: Router = Router();

router.post('/montoventa/:idVenta',crearMontoVenta );


export default router;
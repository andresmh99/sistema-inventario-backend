import { Router } from "express";
import { authJwt } from "../middlewares";
import { crearVenta, obtenerVentas } from "../controllers/venta.controllers";

const router: Router = Router();

router.post('/ventas',crearVenta );
router.get('/ventas',obtenerVentas);


export default router;
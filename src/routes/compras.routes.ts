import { Router } from "express";
import { authJwt } from "../middlewares";
import { crearCompra, obtenerCompras } from "../controllers/compras.controllers";

const router: Router = Router();

router.post('/compras',crearCompra );
router.get('/compras',obtenerCompras);


export default router;
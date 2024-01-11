import { Router } from "express";
import { authJwt } from "../middlewares";
import { buscarVentasPorRangoDeFechas, crearVenta, filtroVenta, obtenerVentas } from "../controllers/venta.controllers";

const router: Router = Router();

router.post('/ventas',crearVenta );
router.get('/ventas',obtenerVentas);
router.get("/ventas/buscar", [authJwt.TokenValidation], filtroVenta);
router.get('/ventas/rango-fechas', buscarVentasPorRangoDeFechas);
//router.delete('/venta/:id', eliminar);


export default router;
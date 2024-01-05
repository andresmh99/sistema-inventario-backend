import { Router } from "express";
import { authJwt } from "../middlewares";
import { actualizarCliente, crearCliente, filtroClientes, obtenerCliente, obtenerClientes } from "../controllers/clientes.controller";


const router: Router = Router();

router.post('/clientes',crearCliente );
router.get('/clientes',obtenerClientes);
router.get("/clientes/buscar", [authJwt.TokenValidation], filtroClientes);
router.get('/clientes/:id', obtenerCliente);
router.put('/clientes/:id',actualizarCliente);
//router.delete('/clientes/:id', eliminarclientes);

export default router;
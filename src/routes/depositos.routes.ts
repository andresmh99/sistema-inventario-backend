import { Router } from "express";
import { authJwt } from "../middlewares";
import { crearDeposito, obtenerDepositosCaja } from "../controllers/depositos.controlles";

const router: Router = Router();

router.post('/depositos',crearDeposito );
router.get('/depositos',obtenerDepositosCaja);

export default router;
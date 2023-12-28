import { Router } from "express";

import { obtenerRoles } from "../controllers/rol.controlles";

const router: Router = Router();

router.get("/rol", obtenerRoles);

export default router;

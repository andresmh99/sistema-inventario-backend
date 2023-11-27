import { Router } from "express";
import { iniciarSesion } from "../controllers/login.controllers";

const router: Router = Router();


router.post('/signin', iniciarSesion);
//router.get('/profile',[authJwt.TokenValidation], profile);

export default router;
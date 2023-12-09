import { Router } from "express";
import AuthController  from "../Controllers/AuthController";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post('/exchange', AuthController. exchangeRefreshToken);

export default router;

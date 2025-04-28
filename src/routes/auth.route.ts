import { Router } from "express";
import * as authController from "../controller/auth.Controller.js";

const router = Router();

router.post("/register", authController.register as any); //bu xatoni faqat any orqali yecha oldim xolos menimcha kichik proekt uchun Okey.
router.post("/login", authController.login as any);

export default router;

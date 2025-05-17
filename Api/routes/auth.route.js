import express from "express";
import { login, logout, register, verifyEmail , registerAdmin} from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail); 
router.post("/admin-register", registerAdmin);

export default router;

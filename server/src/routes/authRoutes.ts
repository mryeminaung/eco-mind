import { Router } from "express";
import { changePassword, login, me, register, updateProfile } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.patch("/me", protect, updateProfile);
router.patch("/password", protect, changePassword);

export default router;

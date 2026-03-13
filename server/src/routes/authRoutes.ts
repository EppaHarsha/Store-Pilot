import { Router } from "express";
import { getProfile, loginUser, signupUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

export default router;


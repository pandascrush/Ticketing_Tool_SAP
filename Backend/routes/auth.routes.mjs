import express from 'express';
import { loginUser, Verify, logout } from '../controllers/auth.controller.mjs';
import { verifyToken } from '../middleware/Verification.mjs';

const router = express.Router();

router.post("/login", loginUser);
router.get("/protected-route", verifyToken, Verify);
router.post("/logout", logout);

export default router;

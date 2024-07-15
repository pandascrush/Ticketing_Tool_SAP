// routes/auth.routes.mjs
import express from "express";
import { loginUser } from "../controllers/auth.controller.mjs";

const router = express.Router();

router.post("/login", loginUser);

export default router;

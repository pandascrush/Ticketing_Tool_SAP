// routes/internal.routes.mjs
import express from "express";
import {
  getAllInternals,
  createInternal,
} from "../controllers/internal.controller.mjs";

const router = express.Router();

router.get("/internals", getAllInternals);
router.post("/register", createInternal);

export default router;

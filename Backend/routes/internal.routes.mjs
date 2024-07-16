// routes/internal.routes.mjs
import express from "express";
import {
  getAllInternals,
  createInternal,
  getInternalByHeadId,
} from "../controllers/internal.controller.mjs";

const router = express.Router();

router.get("/internals", getAllInternals);
router.post("/register", createInternal);
router.get('/getInternal/:id',getInternalByHeadId)

export default router;

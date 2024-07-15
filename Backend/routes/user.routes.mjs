// routes/user.routes.mjs
import express from "express";
import { getAllUserTypes } from "../controllers/user.controller.mjs";

const router = express.Router();

router.get("/users/types", getAllUserTypes);

export default router;

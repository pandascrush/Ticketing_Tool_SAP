import express from "express";
import {
  getAvailableServices,
  getClientServices,
} from "../controllers/admin.controller.mjs";

const router = express.Router();

router.get("/client-services", getClientServices);
router.get("/available-services/:clientId", getAvailableServices);

export default router;

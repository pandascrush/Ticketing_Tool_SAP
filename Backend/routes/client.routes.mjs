// routes/client.routes.mjs
import express from "express";
import {
  getAllClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/client.controller.mjs";

const router = express.Router();

router.get("/clients", getAllClients);
router.post("/register", createClient);
router.get("/clients/:client_id", getClientById);
router.put("/clients/:client_id", updateClient);
router.delete("/clients/:client_id", deleteClient);

export default router;

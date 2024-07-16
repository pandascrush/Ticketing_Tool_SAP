// routes/ticket.routes.mjs
import { Router } from "express";
import {
  assignTicket,
  createTicket,
  getAccountManagerTicketDetails,
  getCompanyTicketCounts,
} from "../controllers/ticket.controller.mjs";
import upload from "../middleware/fileUpload.mjs";

const router = Router();

// Client Route
router.post(
  "/create/:company_name/:company_short_name",
  upload.single("screenshot"),
  createTicket
);

// Account Manager Routes
router.get("/count/:am_id", getCompanyTicketCounts);
router.get(
  "/getAMTicketDetail/:am_id/:company_name",
  getAccountManagerTicketDetails
);

// Assigning ticket to the consultant
router.post("/assign", assignTicket);

export default router;

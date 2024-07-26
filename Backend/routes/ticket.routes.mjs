// routes/ticket.routes.mjs
import { Router } from "express";
import {
  assignTicket,
  consultantUpdateTheTicketStatus,
  createTicket,
  getAccountManagerTicketDetails,
  getAccountManagerTrackTickets,
  getClientTicketStatus,
  getCompanyTicketCounts,
  submitTicketChanges,
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

// track ticket submission for acc manager based on the ticket.
router.get("/track/:am_id/:ticket_id", getAccountManagerTrackTickets);

// Account manager send if any changes need in the submission
router.post('/submitChanges',submitTicketChanges)
router.get("/status/:id", getClientTicketStatus);
router.post('/statusupdate',consultantUpdateTheTicketStatus)
export default router;

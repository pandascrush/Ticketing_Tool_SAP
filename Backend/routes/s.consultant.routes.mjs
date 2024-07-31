import express from 'express';
import { getCompaniesWithTicketCounts, getConsultantBasedTicketCount, getConsultantBasedTicketDetails, getSubmitTicketChanges, getSubmitTicketChangesCount, getTicketsForCompanyAndConsultant, submitTicketCorrection } from '../controllers/s.consultant.controller.mjs';
import upload from "../middleware/fileUpload.mjs";

const router = express.Router();

router.get('/companies/:emp_id', getCompaniesWithTicketCounts);
router.get('/tickets/:emp_id/:company_name', getTicketsForCompanyAndConsultant);
router.post('/correct', upload.single('corrected_file'), submitTicketCorrection);
router.get('/submissionChanges/:am_id/:ticket_id',getSubmitTicketChanges)
router.get('/ticketSubmissionCount/:ticket_id',getSubmitTicketChangesCount)

// Consultant DashBoard
router.get('/ticketcount/:id',getConsultantBasedTicketCount)
router.get('/ticketdetail/:id',getConsultantBasedTicketDetails)

export default router;

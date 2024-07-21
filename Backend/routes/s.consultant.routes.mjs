import express from 'express';
import { getCompaniesWithTicketCounts, getTicketsForCompanyAndConsultant, submitTicketCorrection } from '../controllers/s.consultant.controller.mjs';
import upload from "../middleware/fileUpload.mjs";

const router = express.Router();

router.get('/companies/:emp_id', getCompaniesWithTicketCounts);
router.get('/tickets/:emp_id/:company_name', getTicketsForCompanyAndConsultant);
router.post('/correct', upload.single('corrected_file'), submitTicketCorrection);

export default router;

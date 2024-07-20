import express from 'express';
import { getCompaniesWithTicketCounts, getTicketsForCompanyAndConsultant } from '../controllers/s.consultant.controller.mjs';

const router = express.Router();

router.get('/companies/:emp_id', getCompaniesWithTicketCounts);
router.get('/tickets/:emp_id/:company_name', getTicketsForCompanyAndConsultant);

export default router;

// routes/ticket.routes.mjs
import { Router } from 'express';
import { createTicket, getAccountManagerTicketDetails, getCompanyTicketCounts} from '../controllers/ticket.controller.mjs';
import upload from '../middleware/fileUpload.mjs';

const router = Router();

// Client Route
router.post('/create/:company_name/:company_short_name', upload.single('screenshot'), createTicket);

// Account Manager Routes
router.get('/count/:am_id',getCompanyTicketCounts);
router.get('/getAMTicketDetail/:am_id/:company_name', getAccountManagerTicketDetails);

export default router;

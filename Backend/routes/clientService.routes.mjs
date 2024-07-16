import express from 'express';
import { addClientService, getAccountManagers, getClientServices, getServices } from '../controllers/clientServices.controller.mjs';

const router = express.Router();

// Route to add client services
router.post('/add-client-service', addClientService);
router.get('/services', getServices);
router.get("/:client_id/services", getClientServices);
router.get('/account-managers',getAccountManagers)

export default router;

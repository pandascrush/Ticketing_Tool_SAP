import express from 'express';
import { addClientService, getAccountManagers, getAllServices, getClientServices, getServices } from '../controllers/clientServices.controller.mjs';

const router = express.Router();

// Route to add client services
router.post('/add-client-service', addClientService);
router.get('/services', getServices);
router.get("/:client_id/services", getClientServices);
router.get('/account-managers',getAccountManagers)
router.get('/getservicesbyamid/:am_id',getAllServices)

export default router;

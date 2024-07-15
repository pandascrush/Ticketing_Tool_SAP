// routes/designation.routes.mjs
import express from "express";
import { getAllDesignations} from "../controllers/designation.controller.mjs";

const router = express.Router();

router.get("/designations", getAllDesignations);


export default router;

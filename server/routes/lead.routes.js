import express from "express";
import { generateLead } from "../controllers/lead.controller.js";

const router = express.Router();

router.post("/leadGeneration", generateLead);

export default router;

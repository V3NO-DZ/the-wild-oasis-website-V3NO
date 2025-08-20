import express from "express";
import { getAppSettings } from "../controllers/settingsController.js";

const router = express.Router();

// GET /api/settings
router.get("/", getAppSettings);

export default router;

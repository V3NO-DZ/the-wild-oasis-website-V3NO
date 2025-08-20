import express from "express";
import { z } from "zod";
import { validateParams } from "../middlewares/validate.js";
import {
  getCabinWithBookedDates,
  listCabins,
  getPrice,
} from "../controllers/cabinsController.js";

const router = express.Router();

// GET /api/cabins
router.get("/", listCabins);

// GET /api/cabins/:cabinId
const cabinParams = z.object({ cabinId: z.coerce.number().int().positive() });
router.get("/:cabinId", validateParams(cabinParams), getCabinWithBookedDates);

// GET /api/cabins/:cabinId/price
router.get("/:cabinId/price", validateParams(cabinParams), getPrice);

export default router;

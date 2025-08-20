import express from "express";
import { z } from "zod";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validate.js";
import {
  createGuest,
  getGuest,
  updateGuest,
} from "../controllers/guestsController.js";

const router = express.Router();

// GET /api/guests?email=x
const getGuestQuery = z.object({ email: z.string().email() });
router.get("/", validateQuery(getGuestQuery), getGuest);

// POST /api/guests
const createGuestBody = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(200),
});
router.post("/", validateBody(createGuestBody), createGuest);

// PATCH /api/guests/:guestId
const guestIdParams = z.object({ guestId: z.coerce.number().int().positive() });
const updateGuestBody = z.object({
  email: z.string().email().optional(),
  fullName: z.string().min(1).max(200).optional(),
  nationality: z.string().optional(),
  countryFlag: z.string().optional(),
  nationalID: z.string().optional(),
});
router.patch(
  "/:guestId",
  validateParams(guestIdParams),
  validateBody(updateGuestBody),
  updateGuest
);

export default router;

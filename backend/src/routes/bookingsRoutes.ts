import express from "express";
import { z } from "zod";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validate.js";
import {
  createBooking,
  deleteBooking,
  getBooking,
  listBookings,
  updateBooking,
} from "../controllers/bookingsController.js";

const router = express.Router();

// GET /api/bookings?guestId=1 (guestId is optional)
const listQuery = z.object({
  guestId: z.coerce.number().int().positive().optional(),
});
router.get("/", validateQuery(listQuery), listBookings);

// GET /api/bookings/:bookingId
const idParams = z.object({ bookingId: z.coerce.number().int().positive() });
router.get("/:bookingId", validateParams(idParams), getBooking);

// POST /api/bookings
const createSchema = z.object({
  cabinId: z.number().int().positive(),
  guestId: z.number().int().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  numNights: z.number().int().positive(),
  numGuests: z.number().int().positive(),
  observations: z.string().max(1000).optional().nullable(),
  extrasPrice: z.number().int().min(0),
  totalPrice: z.number().int().positive(),
  isPaid: z.boolean(),
  hasBreakfast: z.boolean(),
  status: z
    .enum(["unconfirmed", "confirmed", "checked-in", "checked-out"])
    .default("unconfirmed"),
});
router.post("/", validateBody(createSchema), createBooking);

// PATCH /api/bookings/:bookingId
const updateSchema = createSchema.partial();
router.patch(
  "/:bookingId",
  validateParams(idParams),
  validateBody(updateSchema),
  updateBooking
);

// DELETE /api/bookings/:bookingId
router.delete("/:bookingId", validateParams(idParams), deleteBooking);

export default router;

import type { Request, Response } from "express";
import {
  createBooking as createBookingModel,
  deleteBooking as deleteBookingModel,
  getBooking as getBookingModel,
  getBookings as getBookingsModel,
  getAllBookings as getAllBookingsModel,
  updateBooking as updateBookingModel,
} from "../models/bookingModel.js";

export async function listBookings(req: Request, res: Response) {
  const guestId = req.query.guestId ? Number(req.query.guestId) : null;

  try {
    if (guestId) {
      // If guestId is provided, get bookings for that guest
      const bookings = await getBookingsModel(guestId);
      return res.json(bookings);
    } else {
      // If no guestId is provided, get all bookings
      const bookings = await getAllBookingsModel();
      return res.json(bookings);
    }
  } catch (error) {
    return res.status(500).json({ message: "Bookings could not get loaded" });
  }
}

export async function listAllBookings(req: Request, res: Response) {
  try {
    const bookings = await getAllBookingsModel();
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Bookings could not get loaded" });
  }
}

export async function getBooking(req: Request, res: Response) {
  const id = Number(req.params.bookingId);
  if (!id) return res.status(400).json({ message: "Invalid booking id" });
  try {
    const booking = await getBookingModel(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createBooking(req: Request, res: Response) {
  try {
    const booking = await createBookingModel(req.body);
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

export async function updateBooking(req: Request, res: Response) {
  const id = Number(req.params.bookingId);
  if (!id) return res.status(400).json({ message: "Invalid booking id" });
  try {
    const booking = await updateBookingModel(id, req.body);
    return res.json(booking);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

export async function deleteBooking(req: Request, res: Response) {
  const id = Number(req.params.bookingId);
  if (!id) return res.status(400).json({ message: "Invalid booking id" });
  try {
    await deleteBookingModel(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

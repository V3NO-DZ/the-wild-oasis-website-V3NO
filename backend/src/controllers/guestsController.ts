import type { Request, Response } from "express";
import {
  createGuest as createGuestModel,
  getGuestByEmail,
  updateGuest as updateGuestModel,
} from "../models/guestModel.js";

export async function getGuest(req: Request, res: Response) {
  const email = String(req.query.email ?? "");
  if (!email) return res.status(400).json({ message: "email is required" });
  try {
    const guest = await getGuestByEmail(email);
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    return res.json(guest);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createGuest(req: Request, res: Response) {
  try {
    const guest = await createGuestModel(req.body);
    return res.status(201).json(guest);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

export async function updateGuest(req: Request, res: Response) {
  const id = Number(req.params.guestId);
  if (!id) return res.status(400).json({ message: "Invalid guest id" });
  try {
    const guest = await updateGuestModel(id, req.body);
    return res.json(guest);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

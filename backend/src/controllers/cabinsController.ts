import type { Request, Response } from "express";
import {
  getCabin,
  getCabins,
  getCabinPrice,
  getBookedDatesByCabinId,
} from "../models/cabinModel.js";

export async function getCabinWithBookedDates(req: Request, res: Response) {
  const { cabinId } = req.params;
  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    if (!cabin) {
      return res.status(404).json({ message: "cabin not found" });
    }
    return res.json({ cabin, bookedDates });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listCabins(req: Request, res: Response) {
  try {
    const cabins = await getCabins();
    return res.json(cabins);
  } catch {
    return res.status(500).json({ message: "Cabins could not be loaded" });
  }
}

export async function getPrice(req: Request, res: Response) {
  const { cabinId } = req.params;
  try {
    const price = await getCabinPrice(cabinId);
    if (!price) return res.status(404).json({ message: "cabin not found" });
    return res.json(price);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}

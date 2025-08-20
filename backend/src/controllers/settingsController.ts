import type { Request, Response } from "express";
import { getSettings } from "../models/settingsModel.js";

export async function getAppSettings(req: Request, res: Response) {
  try {
    const settings = await getSettings();
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Settings could not be loaded" });
  }
}

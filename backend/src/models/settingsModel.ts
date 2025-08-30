import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Settings = {
  id: number;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
  created_at: Date;
  updated_at: Date;
};

export async function getSettings(): Promise<Settings> {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) throw new Error("Settings not found");
    return settings as Settings;
  } catch (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
}

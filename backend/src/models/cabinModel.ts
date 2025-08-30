import { PrismaClient } from "@prisma/client";
import { eachDayOfInterval } from "date-fns";

const prisma = new PrismaClient();

export type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
};

export type CabinPrice = { regularPrice: number; discount: number };

export async function getCabin(id: string | number): Promise<Cabin | null> {
  try {
    const cabin = await prisma.cabin.findUnique({
      where: { id: Number(id) },
    });
    return cabin;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCabins(): Promise<Cabin[]> {
  try {
    const cabins = await prisma.cabin.findMany({
      select: {
        id: true,
        name: true,
        maxCapacity: true,
        regularPrice: true,
        discount: true,
        image: true,
      },
      orderBy: { name: "asc" },
    });
    return cabins as Cabin[];
  } catch (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
}

export async function getCabinPrice(
  id: string | number
): Promise<CabinPrice | null> {
  try {
    const cabin = await prisma.cabin.findUnique({
      where: { id: Number(id) },
      select: { regularPrice: true, discount: true },
    });
    return cabin as CabinPrice | null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getBookedDatesByCabinId(
  cabinId: number | string
): Promise<Date[]> {
  try {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    const bookings = await prisma.booking.findMany({
      where: {
        cabinId: Number(cabinId),
        OR: [{ startDate: { gte: todayDate } }, { status: "checked-in" }],
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });
    const bookedDates = bookings
      .map((booking: { startDate: Date; endDate: Date }) => {
        return eachDayOfInterval({
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
        });
      })
      .flat();
    return bookedDates;
  } catch (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
}

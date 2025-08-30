import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Booking = {
  id: number;
  created_at: Date;
  startDate: Date;
  endDate: Date;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: number;
  observations?: string | null;
  extrasPrice: number;
  isPaid: boolean;
  hasBreakfast: boolean;
  status: string;
  cabin?: { name: string; image: string } | null;
};

export async function getBooking(id: number): Promise<Booking | null> {
  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    return booking as unknown as Booking | null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getBookings(guestId: number): Promise<Booking[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: { guestId },
      select: {
        id: true,
        created_at: true,
        startDate: true,
        endDate: true,
        numNights: true,
        numGuests: true,
        totalPrice: true,
        guestId: true,
        cabinId: true,
        cabin: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { startDate: "asc" },
    });
    console.log("Fetched bookings (by guestId):", bookings);
    return bookings as unknown as Booking[];
  } catch (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        created_at: true,
        startDate: true,
        endDate: true,
        numNights: true,
        numGuests: true,
        totalPrice: true,
        guestId: true,
        cabinId: true,
        cabin: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { startDate: "asc" },
    });
    console.log("Fetched all bookings:", bookings);
    return bookings as unknown as Booking[];
  } catch (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
}

export async function createBooking(
  data: Omit<Booking, "id" | "created_at" | "cabin">
) {
  try {
    const booking = await prisma.booking.create({
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        numNights: data.numNights,
        numGuests: data.numGuests,
        totalPrice: data.totalPrice,
        guestId: data.guestId,
        cabinId: data.cabinId,
        observations: data.observations,
        extrasPrice: data.extrasPrice,
        isPaid: data.isPaid,
        hasBreakfast: data.hasBreakfast,
        status: data.status,
      },
    });
    return booking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
}

export async function updateBooking(
  id: number,
  updatedFields: Partial<Omit<Booking, "id" | "created_at" | "cabin">>
) {
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: updatedFields,
    });
    return booking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
}

export async function deleteBooking(id: number) {
  try {
    const booking = await prisma.booking.delete({ where: { id } });
    return booking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
}

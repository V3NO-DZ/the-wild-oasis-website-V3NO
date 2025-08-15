import { eachDayOfInterval } from "date-fns";
import { PrismaClient } from "../../../generated/prisma";
import { notFound } from "next/navigation";

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

export type Guest = {
  id?: number;
  email: string;
  fullName: string;
  nationality?: string;
  countryFlag?: string;
  nationalID?: string;
  created_at?: Date;
  updated_at?: Date;
};

// GET

export async function getCabin(id: string | number): Promise<Cabin> {
  try {
    const cabin = await prisma.cabin.findUnique({
      where: { id: Number(id) },
    });

    if (!cabin) {
      notFound();
    }

    return cabin;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export type CabinPrice = { regularPrice: number; discount: number };
export async function getCabinPrice(
  id: string | number
): Promise<CabinPrice | null> {
  try {
    const cabin = await prisma.cabin.findUnique({
      where: { id: Number(id) },
      select: { regularPrice: true, discount: true },
    });

    return cabin;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getCabins = async function (): Promise<Cabin[]> {
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

    return cabins;
  } catch (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string): Promise<Guest | null> {
  try {
    const guest = await prisma.guest.findUnique({
      where: { email },
    });

    // No error here! We handle the possibility of no guest in the sign in callback
    return guest;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// CREATE

export async function createGuest(newGuest: Guest): Promise<Guest> {
  try {
    const guest = await prisma.guest.create({
      data: newGuest,
    });

    return guest;
  } catch (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }
}

export async function getBooking(id: number): Promise<Booking> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }
}

export async function updateBooking(
  id: number,
  updatedFields: Partial<Omit<Booking, "id" | "created_at" | "cabin">>
): Promise<Booking> {
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

    return bookings as Booking[];
  } catch (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
}

export async function getBookedDatesByCabinId(
  cabinId: number | string
): Promise<Date[]> {
  try {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);

    // Getting all bookings
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

    // Converting to actual dates to be displayed in the date picker
    const bookedDates = bookings
      .map((booking) => {
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

    if (!settings) {
      throw new Error("Settings not found");
    }

    return settings;
  } catch (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
}

export async function getCountries(): Promise<
  Array<{ name: string; flag: string }>
> {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = (await res.json()) as Array<{
      name: string;
      flag: string;
    }>;
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////

// export async function createBooking(newBooking) {
//   try {
//     const booking = await prisma.booking.create({
//       data: newBooking
//     });
//     return booking;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Booking could not be created");
//   }
// }

/////////////
// UPDATE

// export async function updateGuest(id, updatedFields) {
//   try {
//     const guest = await prisma.guest.update({
//       where: { id },
//       data: updatedFields
//     });
//     return guest;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Guest could not be updated");
//   }
// }

/////////////
// DELETE

// export async function deleteBooking(id) {
//   try {
//     const booking = await prisma.booking.delete({
//       where: { id }
//     });
//     return booking;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Booking could not be deleted");
//   }
// }

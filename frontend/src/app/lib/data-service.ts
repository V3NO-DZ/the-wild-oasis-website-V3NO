import { eachDayOfInterval } from "date-fns";
import {
  apiClient,
  type Cabin,
  type Booking,
  type Guest,
  type Settings,
} from "./api";
import { notFound } from "next/navigation";

export type CabinPrice = { regularPrice: number; discount: number };

// GET

export async function getCabin(id: string | number): Promise<Cabin> {
  try {
    const response = await apiClient.getCabin(id.toString());

    if (!response || !response.cabin) {
      notFound();
    }

    return response.cabin;
  } catch (error) {
    notFound();
  }
}

export async function getCabinPrice(
  id: string | number
): Promise<CabinPrice | null> {
  try {
    const response = await apiClient.getCabin(id.toString());
    return {
      regularPrice: response.cabin.regularPrice,
      discount: response.cabin.discount,
    };
  } catch (error) {
    return null;
  }
}

export const getCabins = async function (): Promise<Cabin[]> {
  try {
    const cabins = await apiClient.getCabins();
    return cabins;
  } catch (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string): Promise<Guest | null> {
  try {
    const guest = await apiClient.getGuestByEmail(email);
    return guest;
  } catch (error) {
    return null;
  }
}

// CREATE

export async function createGuest(newGuest: Guest): Promise<Guest> {
  try {
    const guest = await apiClient.createGuest(newGuest);
    return guest;
  } catch (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }
}

export async function getBooking(id: number): Promise<Booking> {
  try {
    const booking = await apiClient.getBooking(id.toString());

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
    const booking = await apiClient.updateBooking(id.toString(), updatedFields);
    return booking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
}

export async function getBookings(guestId: number): Promise<Booking[]> {
  try {
    const bookings = await apiClient.getBookings(guestId);
    return bookings;
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

    // Getting all bookings (no guestId filter for this function)
    const bookings = await apiClient.getBookings();

    // Filter bookings for this cabin and future dates
    const relevantBookings = bookings.filter((booking: Booking) => {
      const startDate = new Date(booking.startDate);
      return (
        booking.cabinId === Number(cabinId) &&
        (startDate >= todayDate || booking.status === "checked-in")
      );
    });

    // Converting to actual dates to be displayed in the date picker
    const bookedDates = relevantBookings
      .map((booking: Booking) => {
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

export async function getSettings(): Promise<Settings> {
  try {
    const settings = await apiClient.getSettings();

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

// Additional functions for creating bookings
export async function createBooking(newBooking: any) {
  try {
    const booking = await apiClient.createBooking(newBooking);
    return booking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
}

// Additional functions for updating guests
export async function updateGuest(id: number, updatedFields: any) {
  try {
    const guest = await apiClient.updateGuest(id.toString(), updatedFields);
    return guest;
  } catch (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
}

// Additional functions for deleting bookings
export async function deleteBooking(id: number) {
  try {
    const booking = await apiClient.deleteBooking(id.toString());
    return booking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
}

// Re-export types for backward compatibility
export type { Cabin, Booking, Guest, Settings };

import { eachDayOfInterval } from "date-fns";
import { supabaseAdmin } from "./supabase";
import { notFound } from "next/navigation";

export type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  // Allow extra fields from SELECT * when needed
  [key: string]: unknown;
};

export type Booking = {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: number;
  cabins?: { name: string; image: string } | null;
  [key: string]: unknown;
};

export type Guest = {
  id?: number;
  email: string;
  fullName: string;
  nationality?: string;
  countryFlag?: string;
  nationalID?: string;
  [key: string]: unknown;
};

// GET

export async function getCabin(id: string | number): Promise<Cabin> {
  const { data, error } = await supabaseAdmin
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  return data as Cabin;
}

export type CabinPrice = { regularPrice: number; discount: number };
export async function getCabinPrice(
  id: string | number
): Promise<CabinPrice | null> {
  const { data, error } = await supabaseAdmin
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return (data ?? null) as CabinPrice | null;
}

export const getCabins = async function (): Promise<Cabin[]> {
  const { data, error } = await supabaseAdmin
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return (data ?? []) as Cabin[];
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string): Promise<Guest | null> {
  const { data, error } = await supabaseAdmin
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return (data ?? null) as Guest | null;
}

// CREATE

export async function createGuest(newGuest: Guest): Promise<unknown> {
  const { data, error } = await supabaseAdmin.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data as unknown;
}

export async function getBooking(id: number): Promise<Booking> {
  const { data, error, count } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data as Booking;
}
export async function updateBooking(
  id: number,
  updatedFields: Partial<Booking>
): Promise<Booking> {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data as Booking;
}

export async function getBookings(guestId: number): Promise<Booking[]> {
  const { data, error, count } = await supabaseAdmin
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Supabase may return nested arrays for relations; coerce safely to our expected shape
  return (data ?? []) as unknown as Booking[];
}

export async function getBookedDatesByCabinId(
  cabinId: number | string
): Promise<Date[]> {
  const todayDate = new Date();
  todayDate.setUTCHours(0, 0, 0, 0);
  const todayIso = todayDate.toISOString();

  // Getting all bookings
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${todayIso},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates as Date[];
}

export type Settings = {
  minBookingLength: number;
  maxBookingLength: number;
};

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabaseAdmin
    .from("settings")
    .select("*")
    .single();

  // await new Promise((res) => setTimeout(res, 5000));

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data as Settings;
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
//   const { data, error } = await supabaseAdmin
//     .from("bookings")
//     .insert([newBooking])
//     // So that the newly created object gets returned!
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be created");
//   }

//   return data;
// }

/////////////
// UPDATE

// export async function updateGuest(id, updatedFields) {
//   const { data, error } = await supabaseAdmin
//     .from("guests")
//     .update(updatedFields)
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("Guest could not be updated");
//   }
//   return data;
// }

/////////////
// DELETE

// export async function deleteBooking(id) {
//   const { data, error } = await supabaseAdmin
//     .from("bookings")
//     .delete()
//     .eq("id", id);

//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be deleted");
//   }
//   return data;
// }

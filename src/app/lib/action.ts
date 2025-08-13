"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "./auth";
import { supabaseAdmin } from "./supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData: FormData): Promise<void> {
  console.log(formData);
  const session = await getServerSession(authConfig);
  if (!session) throw new Error("you must be logged in ");

  const nationalityField = String(formData.get("nationality") ?? "");
  const [nationality, countryFlag] = nationalityField.split("%");
  const nationalID = String(formData.get("nationalID") ?? "");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };
  const { data, error } = await supabaseAdmin
    .from("guests")
    .update(updateData)
    .eq("id", (session.user as any).guestId)
    .select()
    .single();

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account");
}

export async function deleteReservation(bookingId: number): Promise<void> {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error("you must be logged in ");

  const guestBookings = await getBookings((session.user as any).guestId);
  const guestBookingsId = guestBookings.map((booking) => booking.id);

  if (!guestBookingsId.includes(bookingId))
    throw new Error("you are not allowed to delete this booking");

  const { error } = await supabaseAdmin
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}

type CreateBookingData = {
  cabinId: number;
  cabinPrice: number;
  startDate: string;
  endDate: string;
  numNights: number;
};

export async function createBooking(
  bookingData: CreateBookingData,
  formData: FormData
): Promise<void> {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error("you must be logged in ");

  const newBooking = {
    ...bookingData,
    guestId: (session.user as any).guestId,
    numGuests: Number(formData.get("numGuests") ?? 0),
    observations: String(formData.get("observations") ?? "").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabaseAdmin.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function updateReservation(formData: FormData): Promise<void> {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error("you must be logged in");

  const bookingId = Number(formData.get("bookingId"));

  const guestBookings = await getBookings((session.user as any).guestId);
  const guestBookingsId = guestBookings.map((booking) => booking.id);

  if (!guestBookingsId.includes(bookingId))
    throw new Error("you are not allowed to update this booking");

  const updateData = {
    numGuests: Number(formData.get("numGuests") ?? 0),
    observations: String(formData.get("observations") ?? "").slice(0, 100),
  };

  const { error } = await supabaseAdmin
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect("/account/reservations");
}

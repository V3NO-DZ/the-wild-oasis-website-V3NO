"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "./auth";
import { apiClient } from "./api";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData: FormData): Promise<void> {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error("you must be logged in ");

  const nationalityField = String(formData.get("nationality") ?? "");
  const [nationality, countryFlag] = nationalityField.split("%");
  const nationalID = String(formData.get("nationalID") ?? "");
  if (!nationalID || nationalID.trim().length < 3)
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  try {
    await apiClient.updateGuest(
      (session.user as any).guestId.toString(),
      updateData
    );
  } catch (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account");
}

export async function deleteReservation(bookingId: number): Promise<void> {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error("you must be logged in ");

  const guestBookings = await getBookings((session.user as any).guestId);
  const guestBookingsId = guestBookings.map((booking) => booking.id);

  if (!guestBookingsId.includes(bookingId))
    throw new Error("you are not allowed to delete this booking");

  try {
    await apiClient.deleteBooking(bookingId.toString());
  } catch (error) {
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

  // Validate required data
  if (!bookingData.cabinId || !bookingData.startDate || !bookingData.endDate) {
    throw new Error("Missing required booking information");
  }

  // Parse and validate dates
  const startDate = new Date(bookingData.startDate + "T00:00:00");
  const endDate = new Date(bookingData.endDate + "T00:00:00");

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  if (startDate >= endDate) {
    throw new Error("Start date must be before end date");
  }

  const numGuests = Number(formData.get("numGuests") ?? 0);
  if (numGuests <= 0) {
    throw new Error("Number of guests must be greater than 0");
  }

  const newBooking = {
    cabinId: bookingData.cabinId,
    guestId: (session.user as any).guestId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    numNights: bookingData.numNights,
    numGuests: numGuests,
    observations: String(formData.get("observations") ?? "").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  // Additional validation
  if (
    !newBooking.guestId ||
    !newBooking.cabinId ||
    newBooking.totalPrice <= 0
  ) {
    throw new Error("Invalid booking data");
  }

  try {
    await apiClient.createBooking(newBooking);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Booking could not be created: ${error.message}`);
    }
    throw new Error("Booking could not be created due to a database error");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function updateReservation(formData: FormData): Promise<void> {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error("you must be logged in");

  const guestId = (session.user as any).guestId;
  if (!guestId) throw new Error("Guest ID not found in session");

  const bookingId = Number(formData.get("bookingId"));
  if (!bookingId) throw new Error("Booking ID is required");

  const guestBookings = await getBookings(guestId);
  const guestBookingsId = guestBookings.map((booking) => booking.id);

  if (!guestBookingsId.includes(bookingId))
    throw new Error("you are not allowed to update this booking");

  const numGuests = Number(formData.get("numGuests") ?? 0);
  if (numGuests <= 0) {
    throw new Error("Number of guests must be greater than 0");
  }

  const updateData = {
    numGuests: numGuests,
    observations: String(formData.get("observations") ?? "").slice(0, 100),
  };

  try {
    await apiClient.updateBooking(bookingId.toString(), updateData);
  } catch (error) {
    throw new Error("Booking could not be updated");
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect("/account/reservations");
}

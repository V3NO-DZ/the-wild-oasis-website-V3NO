"use client";

import { differenceInDays } from "date-fns";
import { createBooking } from "../lib/action";
import { useReservation } from "./ReservationContext";
import SubmitButton from "./SubmitButton";
import type { Cabin } from "../lib/data-service";
import type { Session } from "next-auth";
import Image from "next/image";

type ReservationFormProps = { cabin: Cabin; user: { name?: string | null; image?: string | null } };

function ReservationForm({ cabin, user }: ReservationFormProps) {
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;
  const startDate = range.from;
  const endDate = range.to;

  // Only proceed if both dates are defined
  if (!startDate || !endDate) {
    return null;
  }

  const numNights = differenceInDays(endDate, startDate);

  // Only hide the submit button if dates are invalid, keep the form always visible
  const isInvalidRange = !startDate || !endDate || numNights <= 0;

  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate: startDate.toLocaleDateString('en-CA'), // YYYY-MM-DD format
    endDate: endDate.toLocaleDateString('en-CA'), // YYYY-MM-DD format
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      {/* Unified header color to match Cabin component */}
      <div className="bg-blue-950 text-blue-200 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          {user.image && (
            <Image
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full"
              width={32}
              height={32}
              src={user.image}
              alt={user.name || 'User avatar'}
            />
          )}
          <p>{user.name}</p>
        </div>
      </div>

      {/* Updated form background and text to match Cabin colors */}
      <form
        action={async (formData) => {
          try {
            await createBookingWithData(formData);
            resetRange();
          } catch (error: any) {
            // Only show alert for real errors, not NEXT_REDIRECT
            if (error?.message !== "NEXT_REDIRECT") {
              console.error("Booking creation failed:", error);
              alert(
                `Failed to create booking: ${error instanceof Error ? error.message : "Unknown error"
                }`
              );
            }
            // Otherwise, do nothing (redirect will happen)
          }
        }}
        className="bg-blue-900 py-10 px-16 text-lg flex gap-5 flex-col text-blue-100"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-blue-100 text-blue-900 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-blue-100 text-blue-900 w-full shadow-sm rounded-sm placeholder:text-blue-700"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-blue-300 text-base">Start by selecting dates</p>

          {/* Submit button now conditionally rendered based on date range */}
          {!isInvalidRange && (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;

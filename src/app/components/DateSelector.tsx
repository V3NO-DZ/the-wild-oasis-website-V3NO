"use client";

import { differenceInDays, isPast, isSameDay, isWithinInterval } from "date-fns";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";
import { DayPicker } from "react-day-picker";
import { useState } from "react";
import type { DateRange } from "./ReservationContext";
import type { Cabin, Settings } from "../lib/data-service";

function isAlreadyBooked(range: DateRange, datesArr: Date[]) {
  if (!range?.from || !range?.to) return false;

  return datesArr.some((date) =>
    isWithinInterval(date, { start: range.from!, end: range.to! })
  );
}

function DateSelector({ settings, cabin, bookedDates }: { settings: Settings; cabin: Cabin; bookedDates: Date[] }) {
  const { range, setRange, resetRange } = useReservation();
  const [warning, setWarning] = useState("");

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const numNights =
    displayRange?.from && displayRange?.to
      ? differenceInDays(displayRange.to, displayRange.from)
      : 0;

  const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col gap-8 px-4 py-6 bg-blue rounded-2xl shadow-lg">
      {warning && (
        <p className="text-red-600 text-sm text-center font-medium">
          {warning}
        </p>
      )}

      <DayPicker
        className="place-self-center"
        mode="range"
        selected={displayRange as any}
        numberOfMonths={2}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        modifiersClassNames={{
          selected: "bg-emerald-500 text-white",
          range_start: "bg-emerald-600 text-white",
          range_end: "bg-emerald-600 text-white",
          range_middle: "bg-emerald-100 text-emerald-800",
        }}
        disabled={(curDate: Date) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
        onSelect={(range: DateRange | undefined) => {
          if (!range?.from) return;

          if (!range.to) {
            setWarning("");
            setRange(range);
            return;
          }

          const nights = differenceInDays(range.to as Date, range.from as Date);

          if (nights >= minBookingLength && nights <= maxBookingLength) {
            setWarning("");
            setRange(range);
          } else {
            setWarning(
              `Stay must be between ${minBookingLength} and ${maxBookingLength} nights`
            );
            setRange(range);
          }
        }}
      />

      <div className="flex items-center justify-between px-6 py-4 rounded-xl bg-emerald-100 text-emerald-900">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-baseline gap-2">
            {cabin.discount > 0 ? (
              <>
                <span className="text-2xl font-semibold">
                  ${cabin.regularPrice - cabin.discount}
                </span>
                <span className="line-through text-sm text-red-600">
                  ${cabin.regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold">${cabin.regularPrice}</span>
            )}
            <span className="text-sm text-gray-600">/night</span>
          </div>

          {numNights > 0 && (
            <>
              <p className="text-lg font-medium">
                × <span>{numNights}</span>
              </p>
              <p className="text-lg font-semibold">
                Total: ${cabinPrice}
              </p>
            </>
          )}
        </div>

        {(range?.from || range?.to) && (
          <button
            className="px-4 py-2 text-sm font-semibold text-emerald-700 border border-emerald-700 rounded hover:bg-emerald-200 transition"
            onClick={() => {
              resetRange();
              setWarning("");
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;

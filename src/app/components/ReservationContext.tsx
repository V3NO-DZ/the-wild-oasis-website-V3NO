"use client";

import { createContext, useState, useContext } from "react";

export type DateRange = { from?: Date; to?: Date };

type ReservationContextValue = {
  range: DateRange;
  setRange: (range: DateRange) => void;
  resetRange: () => void;
};

const ReservationContext = createContext<ReservationContextValue | undefined>(undefined);

const initialState: DateRange = { from: undefined, to: undefined };

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange>(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation(): ReservationContextValue {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
}

export { ReservationProvider, useReservation };

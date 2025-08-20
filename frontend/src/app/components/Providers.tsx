"use client";

import { SessionProvider } from "next-auth/react";
import { ReservationProvider } from "./ReservationContext";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ReservationProvider>{children}</ReservationProvider>
    </SessionProvider>
  );
} 
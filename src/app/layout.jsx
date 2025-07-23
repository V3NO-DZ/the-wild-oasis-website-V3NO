import Header from "./components/Header";
import "@/app/styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import { ReservationProvider } from "./components/ReservationContext";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "The Wild Oasis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` bg-slate-800 antialiased flex flex-col text-gray-50 min-h-screen ${josefin.className}`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid ">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}

import React from "react";
import Header from "./components/Header";
import "./styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import Providers from "./components/Providers";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "The Wild Oasis",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body
        className={` bg-slate-800 antialiased flex flex-col text-gray-50 min-h-screen ${josefin.className}`}
      >
        <Providers>
          <Header />
          <div className="flex-1 px-8 py-12 grid ">
            <main className="max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}


"use client";

import React from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <button onClick={reset} className="inline-block bg-blue-500 text-gray-800 cursor-pointer px-6 py-3 text-lg">
        Try again
      </button>
    </main>
  );
}

"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = { children: React.ReactNode; pendingLabel: string };

export default function SubmitButton({ children, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-blue-600 cursor-pointer px-8 py-4 text-gray-800 font-semibold hover:bg-blue-400 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

function SignOutButton(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({
        callbackUrl: "/",
        redirect: true
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback: redirect to home page
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="py-3 px-5 cursor-pointer hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5 text-primary-600" />
      <span>{isLoading ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}

export default SignOutButton;

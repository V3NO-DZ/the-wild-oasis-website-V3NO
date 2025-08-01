"use client";

import Image from "next/image";
import { updateGuest } from "../lib/action";
import SubmitButton from "./SubmitButton";

function UpdateProfileForm({ children, guest }) {
  const { fullName, email, countryFlag, nationalID } = guest;

  return (
    // Pass the server action to the form's action prop
    <form
      action={updateGuest}
      className="bg-gray-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label htmlFor="fullName">Full name</label>
        <input
          defaultValue={fullName}
          name="fullName"
          disabled
          className="px-5 py-3 bg-gray-200 text-gray-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email">Email address</label>
        <input
          defaultValue={email}
          name="email"
          disabled
          className="px-5 py-3 bg-gray-200 text-gray-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <div className="relative h-5 w-8">
            <Image
              src={countryFlag}
              alt="flag name"
              fill
              className="object-contain rounded-sm"
            />
          </div>
        </div>
        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID</label>
        <input
          name="nationalID"
          defaultValue={nationalID}
          className="px-5 py-3 bg-gray-200 text-gray-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
      <SubmitButton pendingLabel="Updating...">Update</SubmitButton>
      </div>
    </form>
  );
}



export default UpdateProfileForm;

import SelectCountry from "@/app/components/SelectCountry";
import UpdateProfileForm from "@/app/components/UpdateProfileForm";
import { authConfig } from "@/app/lib/auth";
import { getGuest } from "@/app/lib/data-service";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authConfig);
  const guest = await getGuest(session.user.email);
  const { nationality } = guest;
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-gray-600 w-full shadow-sm rounded-sm"
          defaultCountry={nationality}
        />
      </UpdateProfileForm>
    </div>
  );
}

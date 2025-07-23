import { getServerSession } from "next-auth";
import { authConfig } from "../lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Account",
};

export default async function Page() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login"); // ✅ send user to your custom sign-in page
  }

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome {session.user.name}
    </h2>
  );
}

import ReservationCard from "../../components/ReservationCard";
import { authConfig } from "../../lib/auth";
import { getBookings } from "../../lib/data-service";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Page(): Promise<React.JSX.Element> {
  const session = await getServerSession(authConfig);
  if (!session?.user) return <div>Not authenticated</div>;

  const guestId = (session.user as any).guestId;
  if (!guestId) return <div>Guest ID not found</div>;

  const bookings = await getBookings(guestId);
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <Link className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <ReservationCard booking={booking} key={booking.id} />
          ))}
        </ul>
      )}
    </div>
  );
}

import SubmitButton from "../../../../components/SubmitButton";
import { updateReservation } from "../../../../lib/action";
import { getBooking, getCabin } from "../../../../lib/data-service";

type Params = {
  bookingId: string;
};

export default async function Page({ params }: { params: Promise<Params> }): Promise<React.JSX.Element> {
  const { bookingId } = await params;

  // 1. Fetch the entire booking object first
  // This object should contain the cabinId associated with the booking
  const { cabinId, numGuests, observations } = await getBooking(Number(bookingId));

  // 2. Now use the cabinId from the booking to get the cabin details
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-blue-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form
        action={updateReservation}
        className="bg-orange-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <input type="hidden" value={bookingId} name="bookingId" />
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            defaultValue={numGuests}
            id="numGuests"
            className="px-5 py-3 bg-orange-200 text-orange-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            defaultValue={(observations as string) || ''}
            className="px-5 py-3 bg-orange-200 text-orange-800 w-full shadow-sm rounded-sm"
            aria-label="Observations about your stay"
            placeholder="Any special requirements, allergies, or notes..."
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <SubmitButton pendingLabel="Updating...">
            Update reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

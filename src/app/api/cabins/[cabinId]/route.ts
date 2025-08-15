import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCabin, getBookedDatesByCabinId } from "../../../lib/data-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cabinId: string }> }
) {
  const { cabinId } = await params;
  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    return NextResponse.json({ cabin, bookedDates });
  } catch (error) {
    return NextResponse.json({ message: "cabin not found" }, { status: 404 });
  }
}

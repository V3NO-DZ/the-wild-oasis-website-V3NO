import { Suspense } from "react";
import CabinList from "../components/CabinList";
import Spinner from "../components/Spinner";
import Filter from "../components/Filter";

export const revalidate = 3600;

export const metadata = {
  title: "Cabins",
};

// ✅ Updated type: searchParams is now a Promise in Next.js 15+
type SearchParams = {
  capacity?: string;
};

// ✅ Updated PageProps to reflect the Promise type
type PageProps = {
  searchParams: Promise<SearchParams>; // changed from SearchParams to Promise<SearchParams>
};

export default async function Page({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  // ✅ Await searchParams before accessing its properties
  const params = await searchParams; // added this line

  // ✅ Validate and type the filter parameter
  const capacity = params.capacity;
  const filter: "all" | "small" | "medium" | "large" =
    capacity === "small" || capacity === "medium" || capacity === "large"
      ? capacity
      : "all";

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10 leading-relaxed">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>

      <div className="flex justify-end mb-12">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
      </Suspense>
    </main>
  );
}

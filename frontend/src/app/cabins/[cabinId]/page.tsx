import Cabin from "../../components/Cabin";
import Reservation from "../../components/Reservation";
import Spinner from "../../components/Spinner";
import { getCabin, getCabins } from "../../lib/data-service";
import { Suspense } from "react";

type Params = Promise<{
  cabinId: string;
}>;

export async function generateMetadata({ params }: { params: Params }) {
  const { cabinId } = await params;
  const { name } = await getCabin(cabinId);
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));

  return ids;
}

export default async function Page({ params }: { params: Params }): Promise<React.JSX.Element> {
  const { cabinId } = await params;
  const cabin = await getCabin(cabinId);
  const { name } = cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center">
          Reserve {name} cabin today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}

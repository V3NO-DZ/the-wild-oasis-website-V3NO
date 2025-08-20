import React from "react";
import CabinCard from "./CabinCard";
import { getCabins, type Cabin as CabinType } from "../lib/data-service";

type CabinListProps = { filter: "all" | "small" | "medium" | "large" };

export default async function CabinList({ filter }: CabinListProps) {
  const cabins = await getCabins();

  let displayedCabins: CabinType[];

  if (filter === "all") {
    displayedCabins = cabins;
  } else if (filter === "small") {
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  } else if (filter === "medium") {
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  } else if (filter === "large") {
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
  } else {
    displayedCabins = cabins; // fallback if filter is unknown
  }

  if (!cabins.length) return null;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

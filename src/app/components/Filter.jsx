"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

// ✅ Reusable Button component
function FilterButton({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-4 py-3 hover:bg-blue-800 hover:text-blue-100 transition-colors duration-200 cursor-pointer text-blue-300 font-medium text-sm tracking-wide
        ${filter === activeFilter ? "bg-blue-950 text-blue-100" : ""}`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="border border-blue-800 flex divide-x divide-blue-800 rounded overflow-hidden bg-blue-900">
      <FilterButton
        filter="all"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        All
      </FilterButton>
      <FilterButton
        filter="small"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        1&mdash;3 guests
      </FilterButton>
      <FilterButton
        filter="medium"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        4&mdash;7 guests
      </FilterButton>
      <FilterButton
        filter="large"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        8&mdash;12 guests
      </FilterButton>
    </div>
  );
}

export default Filter;

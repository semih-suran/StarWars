import React, { useState } from "react";
import { usePeople } from "../../hooks/usePeople";
import { useStore } from "../../store/useStore";
import { PersonCard } from "../../components/cards/PersonCard";
import type { Person } from "../../types";

export const PeopleList: React.FC = () => {
  const [page, setPage] = useState(1);
  const searchQuery = useStore((state) => state.searchQuery);

  const { data, isLoading, isError, isPlaceholderData } = usePeople(
    page,
    searchQuery
  );

  if (isLoading)
    return (
      <div className="text-sw-yellow text-center p-10">
        Loading Holocron data...
      </div>
    );
  if (isError)
    return (
      <div className="text-red-500 text-center p-10">
        Failed to fetch data. The Empire is jamming our comms.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data?.results.map((person: Person) => (
          <PersonCard key={person.name} person={person} />
        ))}
      </div>

      <div className="flex justify-center items-center mt-12 gap-6">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="px-6 py-2 bg-gray-800 text-sw-yellow border border-sw-yellow rounded hover:bg-yellow-900 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm font-bold"
        >
          Previous
        </button>

        <span className="text-gray-400 font-mono text-lg">
          Page <span className="text-white">{page}</span>
        </span>

        <button
          onClick={() => {
            if (!isPlaceholderData && data?.next) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isPlaceholderData || !data?.next}
          className="px-6 py-2 bg-gray-800 text-sw-yellow border border-sw-yellow rounded hover:bg-yellow-900 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm font-bold"
        >
          Next
        </button>
      </div>
    </div>
  );
};

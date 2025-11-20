import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSearchStore } from "../../store/useSearchStore";
import {
  fetchAllPages,
  fetchPeople,
  fetchPlanets,
  fetchSpecies,
  fetchStarships,
  fetchVehicles,
} from "../../api/swapi";

import { PersonCard } from "../../components/cards/PersonCard";
import { PlanetCard } from "../../components/cards/PlanetCard";
import { StarshipCard } from "../../components/cards/StarshipCard";
import { VehicleCard } from "../../components/cards/VehicleCard";
import { SpeciesCard } from "../../components/cards/SpeciesCard";

type GlobalResults = {
  people: any[];
  planets: any[];
  starships: any[];
  vehicles: any[];
  species: any[];
};

export const GlobalSearchResults: React.FC = () => {
  const location = useLocation();
  const urlQ = new URLSearchParams(location.search).get("q") ?? "";
  const globalQ = useSearchStore((s) => s.query);
  const setGlobalQ = useSearchStore((s) => s.setQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GlobalResults>({
    people: [],
    planets: [],
    starships: [],
    vehicles: [],
    species: [],
  });

  const activeQuery = (urlQ || globalQ || "").trim();

  useEffect(() => {
    if (urlQ && urlQ !== globalQ) setGlobalQ(urlQ);
  }, [urlQ]);

  useEffect(() => {
    if (!activeQuery) {
      setResults({
        people: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
      });
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [people, planets, starships, vehicles, species] =
          await Promise.all([
            fetchAllPages(fetchPeople, activeQuery),
            fetchAllPages(fetchPlanets, activeQuery),
            fetchAllPages(fetchStarships, activeQuery),
            fetchAllPages(fetchVehicles, activeQuery),
            fetchAllPages(fetchSpecies, activeQuery),
          ]);
        if (cancelled) return;
        setResults({ people, planets, starships, vehicles, species });
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message ?? "Failed to search");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const t = setTimeout(run, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [activeQuery]);

  if (!activeQuery) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Enter a search term to scan the archives.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-sw-yellow mt-10 animate-pulse">
        Scanning entire galaxy database...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-400">
        <div>Error: {error}</div>
      </div>
    );
  }

  const hasAny =
    results.people.length ||
    results.planets.length ||
    results.starships.length ||
    results.vehicles.length ||
    results.species.length;

  if (!hasAny) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl text-white">
          No results found for "
          <span className="text-sw-yellow">{activeQuery}</span>"
        </h2>
        <p className="text-gray-400">Try a different term or check spelling.</p>
      </div>
    );
  }

  const gridClass =
    "grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]";

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold text-white border-b border-gray-800 pb-4">
        Search Results: <span className="text-sw-yellow">{activeQuery}</span>
      </h2>

      {results.people.length > 0 && (
        <section>
          <h3 className="text-xl text-sw-yellow mb-4 font-bold uppercase tracking-wider">
            People
          </h3>
          <div className={gridClass}>
            {results.people.map((p) => (
              <div key={p.url ?? p.name}>
                <PersonCard person={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {results.planets.length > 0 && (
        <section>
          <h3 className="text-xl text-sw-yellow mb-4 font-bold uppercase tracking-wider">
            Planets
          </h3>
          <div className={gridClass}>
            {results.planets.map((p) => (
              <div key={p.url ?? p.name}>
                <PlanetCard data={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {results.starships.length > 0 && (
        <section>
          <h3 className="text-xl text-sw-yellow mb-4 font-bold uppercase tracking-wider">
            Starships
          </h3>
          <div className={gridClass}>
            {results.starships.map((p) => (
              <div key={p.url ?? p.name}>
                <StarshipCard data={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {results.vehicles.length > 0 && (
        <section>
          <h3 className="text-xl text-sw-yellow mb-4 font-bold uppercase tracking-wider">
            Vehicles
          </h3>
          <div className={gridClass}>
            {results.vehicles.map((p) => (
              <div key={p.url ?? p.name}>
                <VehicleCard data={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {results.species.length > 0 && (
        <section>
          <h3 className="text-xl text-sw-yellow mb-4 font-bold uppercase tracking-wider">
            Species
          </h3>
          <div className={gridClass}>
            {results.species.map((p) => (
              <div key={p.url ?? p.name}>
                <SpeciesCard data={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default GlobalSearchResults;

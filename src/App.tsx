import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

import { Modal } from "./components/ui/Modal";
import { ResourceList } from "./components/ui/ResourceList";
import {
  fetchPeople,
  fetchPlanets,
  fetchSpecies,
  fetchStarships,
  fetchVehicles,
} from "./api/swapi";
import { GlobalSearchResults } from "./features/search/GlobalSearchResults";

import { PersonCard } from "./components/cards/PersonCard";
import { PlanetCard } from "./components/cards/PlanetCard";
import { StarshipCard } from "./components/cards/StarshipCard";
import { VehicleCard } from "./components/cards/VehicleCard";
import { SpeciesCard } from "./components/cards/SpeciesCard";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/people" replace />} />

          <Route
            path="/people"
            element={
              <ResourceList
                resourceKey="people"
                fetchFn={fetchPeople}
                renderCard={(person) => <PersonCard person={person} />}
              />
            }
          />

          <Route
            path="/planets"
            element={
              <ResourceList
                resourceKey="planets"
                fetchFn={fetchPlanets}
                renderCard={(planet) => <PlanetCard data={planet} />}
              />
            }
          />

          <Route
            path="/starships"
            element={
              <ResourceList
                resourceKey="starships"
                fetchFn={fetchStarships}
                renderCard={(ship) => <StarshipCard data={ship} />}
              />
            }
          />

          <Route
            path="/vehicles"
            element={
              <ResourceList
                resourceKey="vehicles"
                fetchFn={fetchVehicles}
                renderCard={(vehicle) => <VehicleCard data={vehicle} />}
              />
            }
          />

          <Route
            path="/species"
            element={
              <ResourceList
                resourceKey="species"
                fetchFn={fetchSpecies}
                renderCard={(specie) => <SpeciesCard data={specie} />}
              />
            }
          />

          <Route
            path="*"
            element={
              <div className="text-center p-10 text-gray-500">Not found</div>
            }
          />

          <Route path="/search" element={<GlobalSearchResults />} />
        </Routes>
        <Modal />
      </Layout>
    </BrowserRouter>
  );
}

export default App;

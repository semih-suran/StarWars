import type { Planet } from '../../types';
import { getIdFromUrl } from '../../types';
import { SwapiImage } from '../ui/SwapiImage';

export const PlanetCard = ({ data }: { data: Planet }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform border border-gray-700">
    <SwapiImage category="planets" id={getIdFromUrl(data.url)} name={data.name} />
    <div className="p-4">
      <h3 className="text-lg font-bold text-sw-yellow mb-2 truncate">{data.name}</h3>
      <div className="text-gray-400 text-xs space-y-1">
        <p>Climate: <span className="text-gray-200">{data.climate}</span></p>
        <p>Terrain: <span className="text-gray-200">{data.terrain}</span></p>
        <p>Pop: <span className="text-gray-200">{data.population}</span></p>
      </div>
    </div>
  </div>
);
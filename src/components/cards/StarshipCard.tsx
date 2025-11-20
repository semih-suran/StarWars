import type { Starship } from '../../types';
import { getIdFromUrl } from '../../types';
import { SwapiImage } from '../ui/SwapiImage';

export const StarshipCard = ({ data }: { data: Starship }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform border border-gray-700">
    <SwapiImage category="starships" id={getIdFromUrl(data.url)} name={data.name} />
    <div className="p-4">
      <h3 className="text-lg font-bold text-sw-yellow mb-2 truncate">{data.name}</h3>
      <div className="text-gray-400 text-xs space-y-1">
        <p>Class: <span className="text-gray-200 truncate block">{data.starship_class}</span></p>
        <p>Cost: <span className="text-gray-200">{data.cost_in_credits}</span></p>
        <p>Hyperdrive: <span className="text-gray-200">{data.hyperdrive_rating}</span></p>
      </div>
    </div>
  </div>
);
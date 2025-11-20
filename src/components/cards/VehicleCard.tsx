import type { Vehicle } from '../../types';
import { getIdFromUrl } from '../../types';
import { SwapiImage } from '../ui/SwapiImage';

export const VehicleCard = ({ data }: { data: Vehicle }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform border border-gray-700">
    <SwapiImage category="vehicles" id={getIdFromUrl(data.url)} name={data.name} />
    <div className="p-4">
      <h3 className="text-lg font-bold text-sw-yellow mb-2 truncate">{data.name}</h3>
      <div className="text-gray-400 text-xs space-y-1">
        <p>Model: <span className="text-gray-200 truncate block">{data.model}</span></p>
        <p>Manufacturer: <span className="text-gray-200 truncate block">{data.manufacturer}</span></p>
      </div>
    </div>
  </div>
);
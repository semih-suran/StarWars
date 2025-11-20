export interface SWAPIResource {
  name: string;
  url: string;
}

export interface Person extends SWAPIResource {
  height: string;
  mass: string;
  gender: string;
  birth_year: string;
}

export interface Planet extends SWAPIResource {
  climate: string;
  terrain: string;
  population: string;
  diameter: string;
}

export interface Species extends SWAPIResource {
  classification: string;
  designation: string;
  average_height: string;
  language: string;
}

export interface Starship extends SWAPIResource {
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  hyperdrive_rating: string;
}

export interface Vehicle extends SWAPIResource {
  model: string;
  vehicle_class: string;
  manufacturer: string;
  cost_in_credits: string;
}

export interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getIdFromUrl = (url: string): string => {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
};
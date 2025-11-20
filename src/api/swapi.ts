import axios from "axios";
import type {
  APIResponse,
  Person,
  Planet,
  Species,
  Starship,
  Vehicle,
} from "../types";

const api = axios.create({
  baseURL: "https://swapi.dev/api/",
  timeout: 10000,
});

export const fetchList = async <T>(
  endpoint: string,
  page = 1,
  search = ""
): Promise<APIResponse<T>> => {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  const { data } = await api.get<APIResponse<T>>(endpoint, { params });
  return data;
};

export const fetchPeople = (page = 1, search = "") =>
  fetchList<Person>("people/", page, search);
export const fetchPlanets = (page = 1, search = "") =>
  fetchList<Planet>("planets/", page, search);
export const fetchSpecies = (page = 1, search = "") =>
  fetchList<Species>("species/", page, search);
export const fetchStarships = (page = 1, search = "") =>
  fetchList<Starship>("starships/", page, search);
export const fetchVehicles = (page = 1, search = "") =>
  fetchList<Vehicle>("vehicles/", page, search);

export const fetchByUrl = async <T>(url: string): Promise<T> => {
  const { data } = await axios.get<T>(url, { timeout: 10000 });
  return data;
};

export const fetchAllPages = async <T>(
  fetchFn: (page?: number, search?: string) => Promise<APIResponse<T>>,
  search = ""
): Promise<T[]> => {
  const results: T[] = [];
  let page = 1;
  while (true) {
    const res = await fetchFn(page, search);
    if (res?.results?.length) results.push(...res.results);
    if (!res.next) break;
    page += 1;
    if (page > 100) break;
  }
  return results;
};

export const fetchMultipleByUrls = async <T = unknown>(
  urls: string[]
): Promise<T[]> => {
  const requests: Promise<T | null>[] = urls.map((url) =>
    axios
      .get<T>(url, { timeout: 10000 })
      .then((r) => r.data)
      .catch(() => null)
  );

  const results = (await Promise.all(requests)) as (T | null)[];
  const filtered = results.filter((r): r is T => r != null);

  return filtered;
};

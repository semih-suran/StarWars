import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchPeople } from '../api/swapi';

export const usePeople = (page: number, search: string) => {
  return useQuery({
    queryKey: ['people', page, search], 
    queryFn: () => fetchPeople(page, search),
    
    // Preventing layout shift/flashing when changing pages
    placeholderData: keepPreviousData, 
    
    // Cache data for 5 minutes
    staleTime: 1000 * 60 * 5, 
  });
};
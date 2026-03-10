import { fetchPopulationData } from './api';

export const populationQueryOptions = {
  queryKey: ['population-data'],
  queryFn: fetchPopulationData,
  // staleTime: 1000 * 60 * 60 * 24,
};

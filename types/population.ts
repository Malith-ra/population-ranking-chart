export type PopulationRow = {
  country: string;
  year: number;
  population: number;
};

export type ChartRow = PopulationRow & {
  color: string;
};
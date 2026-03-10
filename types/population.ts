export type PopulationRow = {
  country: string;
  countryCode: string;
  year: number;
  population: number;
};

export type PopulationChartRow = PopulationRow & {
  color: string;
};

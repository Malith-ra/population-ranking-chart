import { PopulationChartRow, PopulationRow } from '@/types/population';

export const COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#14B8A6',
  '#EC4899',
  '#6366F1',
  '#84CC16',
  '#F97316',
  '#06B6D4',
  '#D946EF',
  '#22C55E',
  '#E11D48',
  '#A855F7',
];

export function getYears(data: PopulationRow[]) {
  return [...new Set(data.map((item) => item.year))].sort((a, b) => a - b);
}

export function getInitialYear(years: number[]) {
  if (years.includes(2026)) return 2026;
  return years[years.length - 1];
}

export function formatPopulation(value: number) {
  return new Intl.NumberFormat().format(value);
}

export function getChartData(
  data: PopulationRow[],
  selectedYear: number,
  limit: number,
  selectedCountries: string[],
  order: string,
): PopulationChartRow[] {
  const yearData = data.filter((item) => item.year === selectedYear);

  const filteredData =
    selectedCountries.length > 0
      ? yearData.filter((item) => selectedCountries.includes(item.country))
      : yearData;

  const sortedData = [...filteredData].sort((a, b) =>
    order === 'lowest'
      ? a.population - b.population
      : b.population - a.population,
  );

  return sortedData.slice(0, limit).map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));
}

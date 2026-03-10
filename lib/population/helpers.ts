import { PopulationChartRow, PopulationRow } from '@/types/population';

const COLORS = [
  '#2563eb',
  '#dc2626',
  '#16a34a',
  '#9333ea',
  '#ea580c',
  '#0891b2',
  '#ca8a04',
  '#db2777',
  '#4f46e5',
  '#059669',
  '#e11d48',
  '#7c3aed',
  '#0f766e',
  '#b45309',
  '#1d4ed8',
];

export function getCountryColor(country: string) {
  let hash = 0;

  for (let i = 0; i < country.length; i += 1) {
    hash = country.charCodeAt(i) + ((hash << 5) - hash);
  }

  return COLORS[Math.abs(hash) % COLORS.length];
}

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
): PopulationChartRow[] {
  const yearData = data.filter((item) => item.year === selectedYear);

  const filteredData =
    selectedCountries.length > 0
      ? yearData.filter((item) => selectedCountries.includes(item.country))
      : yearData;

  return filteredData
    .sort((a, b) => b.population - a.population)
    .slice(0, limit)
    .map((item) => ({
      ...item,
      color: getCountryColor(item.country),
    }));
}

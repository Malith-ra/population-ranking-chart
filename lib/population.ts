import { ChartRow, PopulationRow } from '@/types/population';

const WORLD_BANK_URL =
  'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000';

const EXCLUDED_REGIONS = new Set([
  'World',
]);

type WorldBankItem = {
  country: { value: string };
  date: string;
  value: number | null;
};

export async function fetchPopulationData(): Promise<PopulationRow[]> {
  const res = await fetch(WORLD_BANK_URL, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch population data');
  }

  const json = (await res.json()) as [unknown, WorldBankItem[]];
  const rows = json[1] ?? [];

  return rows
    .filter((item) => item.value !== null)
    .filter((item) => !EXCLUDED_REGIONS.has(item.country.value))
    .map((item) => ({
      country: item.country.value,
      year: Number(item.date),
      population: item.value as number,
    }));
}

export function getYears(data: PopulationRow[]): number[] {
  return [...new Set(data.map((item) => item.year))].sort((a, b) => a - b);
}

export function getTopCountriesByYear(
  data: PopulationRow[],
  year: number,
  limit = 10,
): ChartRow[] {
  return data
    .filter((item) => item.year === year)
    .sort((a, b) => b.population - a.population)
    .slice(0, limit)
    .map((item) => ({
      ...item,
      color: getCountryColor(item.country),
    }));
}

function getCountryColor(country: string): string {
  const colors = [
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

  let hash = 0;
  for (let i = 0; i < country.length; i += 1) {
    hash = country.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
import type { PopulationChartRow, PopulationRow } from '@/types/population';

const WORLD_BANK_URL =
  'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000';

type WorldBankItem = {
  country: { value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
};

const EXCLUDED_REGIONS = new Set([
  'World',
  'IDA & IBRD total',
  'Low & middle income',
  'Middle income',
  'IBRD only',
  'Upper middle income',
  'Lower middle income',
  'East Asia & Pacific',
  'Europe & Central Asia',
  'Latin America & Caribbean',
  'Latin America & the Caribbean',
  'Middle East & North Africa',
  'South Asia',
  'Sub-Saharan Africa',
  'North America',
  'East Asia & Pacific (excluding high income)',
  'East Asia & Pacific (IDA & IBRD countries)',
  'Europe & Central Asia (excluding high income)',
  'Europe & Central Asia (IDA & IBRD countries)',
  'Latin America & the Caribbean (excluding high income)',
  'Latin America & Caribbean (IDA & IBRD countries)',
  'Middle East & North Africa (excluding high income)',
  'Middle East & North Africa (IDA & IBRD countries)',
  'South Asia (IDA & IBRD)',
  'Sub-Saharan Africa (excluding high income)',
  'Sub-Saharan Africa (IDA & IBRD countries)',
  'IDA total',
  'IDA blend',
  'IDA only',
  'Not classified',
  'High income',
  'Low income',
  'Least developed countries: UN classification',
  'Early-demographic dividend',
  'Late-demographic dividend',
  'Pre-demographic dividend',
  'Post-demographic dividend',
  'Fragile and conflict affected situations',
  'Heavily indebted poor countries (HIPC)',
  'OECD members',
  'Other small states',
  'Small states',
  'Arab World',
  'Central Europe and the Baltics',
  'Euro area',
  'European Union',
  'Pacific island small states',
  'Caribbean small states',
]);

export async function fetchPopulationData(): Promise<PopulationRow[]> {
  const res = await fetch(WORLD_BANK_URL, {
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch population data');
  }

  const json = (await res.json()) as [unknown, WorldBankItem[]];
  const rows = json[1] ?? [];

  return rows
    .filter(
      (item): item is WorldBankItem & { value: number } => item.value !== null,
    )
    .filter((item) => !EXCLUDED_REGIONS.has(item.country.value))
    .map((item) => ({
      country: item.country.value,
      countryCode: item.countryiso3code,
      year: Number(item.date),
      population: item.value,
    }));
}

export function getYears(data: PopulationRow[]): number[] {
  return [...new Set(data.map((item) => item.year))].sort((a, b) => a - b);
}

export function getTopCountriesByYear(
  data: PopulationRow[],
  year: number,
  limit = 10,
): PopulationChartRow[] {
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
    hash = country.codePointAt(i)! + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

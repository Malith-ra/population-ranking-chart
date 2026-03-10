import { PopulationRow } from '@/types/population';

const WORLD_BANK_COUNTRIES_URL =
  'https://api.worldbank.org/v2/country?format=json&per_page=400';

const WORLD_BANK_POPULATION_URL =
  'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000';

type WorldBankCountryItem = {
  id: string;
  iso2Code: string;
  name: string;
  region: {
    id: string;
    value: string;
  };
};

type WorldBankPopulationItem = {
  country: {
    id: string;
    value: string;
  };
  date: string;
  value: number | null;
};

async function fetchRealCountryCodes(): Promise<Set<string>> {
  const response = await fetch(WORLD_BANK_COUNTRIES_URL, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch country list');
  }

  const json = (await response.json()) as [unknown, WorldBankCountryItem[]];
  const rows = json[1] ?? [];

  const realCountries = rows.filter(
    (item) =>
      item.region?.value !== 'Aggregates' &&
      item.iso2Code &&
      item.iso2Code.length === 2,
  );

  return new Set(realCountries.map((item) => item.iso2Code));
}

export async function fetchPopulationData(): Promise<PopulationRow[]> {
  const [validCountryCodes, populationResponse] = await Promise.all([
    fetchRealCountryCodes(),
    fetch(WORLD_BANK_POPULATION_URL, {
      next: { revalidate: 86400 },
      // cache: 'no-store',
    }),
  ]);

  if (!populationResponse.ok) {
    throw new Error('Failed to fetch population data');
  }

  const json = (await populationResponse.json()) as [
    unknown,
    WorldBankPopulationItem[],
  ];

  const rows = json[1] ?? [];

  return rows
    .filter((item) => item.value !== null)
    .filter((item) => validCountryCodes.has(item.country.id))
    .map((item) => ({
      country: item.country.value,
      countryCode: item.country.id,
      year: Number(item.date),
      population: item.value as number,
    }));
}

import PopulationChart from '@/components/PopulationChart/PopulationChart';
import { fetchPopulationData, getYears } from '@/lib/population';

export default async function Page() {
  const populationData = await fetchPopulationData();
  const years = getYears(populationData);
  const initialYear = years[years.length - 1];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Countries Population by Year
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Top 10 countries by population with year navigation
        </p>
      </div>

      <PopulationChart
        initialData={populationData}
        initialYear={initialYear}
      />
    </main>
  );
}
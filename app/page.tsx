import { PopulationDashboard } from '@/components/dashboard/population-dashboard';
import { fetchPopulationData } from '@/lib/population/api';
import { getInitialYear, getYears } from '@/lib/population/helpers';

export default async function Page() {
  const populationData = await fetchPopulationData();

  const years = getYears(populationData);

  const initialYear = getInitialYear(years);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <PopulationDashboard
        initialData={populationData}
        initialYear={initialYear}
      />
    </main>
  );
}

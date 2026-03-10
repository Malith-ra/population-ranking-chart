'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  fetchPopulationData,
  getTopCountriesByYear,
  getYears,
} from '@/lib/population';
import type { PopulationRow } from '@/types/population';

type Props = {
  initialData: PopulationRow[];
  initialYear: number;
};

export default function PopulationChart({
  initialData,
  initialYear,
}: Readonly<Props>) {
  const { data = [] } = useQuery({
    queryKey: ['population-data'],
    queryFn: fetchPopulationData,
    initialData,
    // staleTime: 1000 * 60 * 60 * 24,
  });

  const years = useMemo(() => getYears(data), [data]);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const currentYearIndex = years.findIndex((year) => year === selectedYear);

  const chartData = useMemo(() => {
    return getTopCountriesByYear(data, selectedYear, 10).reverse();
  }, [data, selectedYear]);

  const handlePrev = () => {
    if (currentYearIndex > 0) {
      setSelectedYear(years[currentYearIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentYearIndex < years.length - 1) {
      setSelectedYear(years[currentYearIndex + 1]);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentYearIndex <= 0}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500">Selected year</p>
          <h2 className="text-2xl font-semibold">{selectedYear}</h2>
        </div>

        <button
          onClick={handleNext}
          disabled={currentYearIndex === years.length - 1}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">Showing top 10 countries</div>

      <div className="h-[640px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatPopulation} />
            <YAxis type="category" dataKey="country" width={140} />
            <Tooltip formatter={(value: number) => formatPopulation(value)} />
            <Bar
              dataKey="population"
              radius={[0, 10, 10, 0]}
              isAnimationActive
              animationDuration={500}
            >
              {chartData.map((item) => (
                <Cell key={`${item.country}-${item.year}`} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function formatPopulation(value: number) {
  return new Intl.NumberFormat().format(value);
}
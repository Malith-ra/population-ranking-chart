'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PopulationRow } from '@/types/population';
import { populationQueryOptions } from '@/lib/population/queries';
import {
  DEFAULT_COUNTRY_LIMIT,
  FAMOUS_COUNTRIES,
} from '@/lib/population/constants';
import { getChartData, getYears } from '@/lib/population/helpers';
import { YearNavigation } from './year-navigation';
import { PopulationBarChart } from './population-bar-chart';
import { CountryLimitSelect } from './country-limit-select';
import { CountryMultiSelect } from './country-multi-select';
import { OrderSelect } from '../population/order-select';

type Props = {
  initialData: PopulationRow[];
  initialYear: number;
};

export function PopulationDashboard({ initialData, initialYear }: Props) {
  const { data = initialData } = useQuery({
    ...populationQueryOptions,
    initialData,
  });

  const years = useMemo(() => getYears(data), [data]);

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [countryLimit, setCountryLimit] = useState(DEFAULT_COUNTRY_LIMIT);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [order, setOrder] = useState('highest');

  const currentYearIndex = years.findIndex((year) => year === selectedYear);

  const chartData = useMemo(() => {
    return getChartData(
      data,
      selectedYear,
      Number(countryLimit),
      selectedCountries,
      order,
    );
  }, [data, selectedYear, countryLimit, selectedCountries, order]);

  const handlePrevious = () => {
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
    <section className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Countries Population by Year
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Highest population shown at the top
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <CountryLimitSelect value={countryLimit} onChange={setCountryLimit} />

        <OrderSelect value={order} onChange={setOrder} />

        <CountryMultiSelect
          options={FAMOUS_COUNTRIES}
          selectedValues={selectedCountries}
          onChange={setSelectedCountries}
        />
      </div>

      <YearNavigation
        selectedYear={selectedYear}
        onPrevious={handlePrevious}
        onNext={handleNext}
        disablePrevious={currentYearIndex <= 0}
        disableNext={currentYearIndex >= years.length - 1}
      />

      <PopulationBarChart data={chartData} />
    </section>
  );
}

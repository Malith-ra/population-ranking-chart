'use client';

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
import { PopulationChartRow } from '@/types/population';
import { formatPopulation } from '@/lib/population/helpers';

type Props = {
  data: PopulationChartRow[];
};

export function PopulationBarChart({ data }: Props) {
  return (
    <div className="h-[650px] w-full rounded-2xl border bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={formatPopulation} />
          <YAxis type="category" dataKey="country" width={140} />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number' ? formatPopulation(value) : value
            }
          />
          <Bar
            dataKey="population"
            radius={[0, 10, 10, 0]}
            isAnimationActive
            animationDuration={500}
          >
            {data.map((item) => (
              <Cell
                key={`${item.countryCode}-${item.year}`}
                fill={item.color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

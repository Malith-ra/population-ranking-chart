type Props = {
  selectedYear: number;
};

export function ChartHeader({ selectedYear }: Props) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Population Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Population ranking by year with filters
        </p>
      </div>

      <div className="rounded-xl bg-slate-100 px-4 py-2 text-center">
        <p className="text-xs text-muted-foreground">Selected year</p>
        <p className="text-xl font-semibold">{selectedYear}</p>
      </div>
    </div>
  );
}
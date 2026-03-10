type Props = {
  selectedYear: number;
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious: boolean;
  disableNext: boolean;
};

export function YearNavigation({
  selectedYear,
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
}: Props) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={onPrevious}
        disabled={disablePrevious}
        className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-500">Selected year</p>
        <h2 className="text-2xl font-semibold">{selectedYear}</h2>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={disableNext}
        className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

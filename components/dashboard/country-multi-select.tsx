'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
};

export function CountryMultiSelect({
  options,
  selectedValues,
  onChange,
}: Props) {
  const toggleCountry = (country: string) => {
    if (selectedValues.includes(country)) {
      onChange(selectedValues.filter((item) => item !== country));
      return;
    }

    onChange([...selectedValues, country]);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Preferred countries</label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
          >
            {selectedValues.length > 0
              ? `${selectedValues.length} countries selected`
              : 'All countries'}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options.map((country) => {
                  const selected = selectedValues.includes(country);

                  return (
                    <CommandItem
                      key={country}
                      onSelect={() => toggleCountry(country)}
                      className="flex cursor-pointer items-center justify-between"
                    >
                      <span>{country}</span>
                      <Check
                        className={`h-4 w-4 ${selected ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>

            <div className="border-t p-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="w-full"
              >
                Clear all
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((country) => (
            <Badge
              key={country}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {country}
              <button type="button" onClick={() => toggleCountry(country)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

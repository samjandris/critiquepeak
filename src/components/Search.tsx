import { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import useSWR from 'swr';
import { Autocomplete, AutocompleteItem, Image } from '@nextui-org/react';
import { searchMovies } from '@/lib/film';
import { Film } from '@/lib/types';

export default function Search({
  type = 'film',
  onSelectionChange,
  className,
}: {
  type: string;
  onSelectionChange: (item: Film | null) => void;
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Film | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: searchResults, isLoading: searchResultsIsLoading } = useSWR(
    ['search', type, debouncedSearchTerm],
    () => {
      if (!debouncedSearchTerm) return;
      if (debouncedSearchTerm.toLowerCase() === selectedItem?.title) return;
      if (type === 'film') {
        return searchMovies(debouncedSearchTerm, { posterSize: 'w185' });
      }
    }
  );

  return (
    <Autocomplete
      size="lg"
      label={'Search for a ' + type}
      menuTrigger="input"
      defaultItems={searchResults || []}
      isLoading={searchResultsIsLoading}
      onInputChange={(searchInput) => {
        if (
          searchInput.toLowerCase() !== searchTerm.toLowerCase() &&
          searchInput.toLowerCase() !== selectedItem?.title.toLowerCase()
        ) {
          setSearchTerm(searchInput);
        }
      }}
      onSelectionChange={(searchId) => {
        if (!searchId) return;
        const selection =
          searchResults?.find((item: Film) => item.id == searchId) || null;
        setSelectedItem(selection);
        onSelectionChange(selection);
      }}
      className={className}
    >
      {(result: Film) => (
        <AutocompleteItem
          key={result.id}
          startContent={
            <Image
              src={result.poster}
              alt={result.title}
              isBlurred
              shadow="md"
              className="h-12 aspect-[1/1.5] rounded-md object-contain"
            />
          }
        >
          {result.title}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

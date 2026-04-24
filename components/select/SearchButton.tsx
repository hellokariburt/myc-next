import { IconSearch } from '@tabler/icons-react';

const SearchButton = ({ onClick }: SearchButtonProps) => (
  <button
    type="button"
    aria-label="Search for mics"
    onClick={onClick}
    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full text-base transition-colors"
  >
    <IconSearch size={20} />
    Search for mics
  </button>
);

export default SearchButton;

export type SearchButtonProps = {
  onClick: () => void;
};

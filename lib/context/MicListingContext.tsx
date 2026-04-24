'use client';

import { createContext, useEffect } from 'react';
import { IconMicrophoneOff } from '@tabler/icons-react';
import { useMics } from '../hooks/useMics';
import { ClearQuery, GetQuery, SetPagination, SetQuery, useQuery } from '../hooks/useQuery';

export const MicListingContext = createContext<MicListingContextState>({
  mics: undefined,
  isLoading: false,
  setQuery: () => null,
});

export const MicListingContextProvider = ({ children }: MicListingContextProps) => {
  const [params, setQuery, clearQuery, getQuery, setPagination] = useQuery();

  const search = getQuery();

  const { data, isLoading, refetch, error, isError } = useMics(search);

  useEffect(() => {
    refetch();
  }, [search]);

  const renderError = () => (
    <div className="p-32 flex flex-col">
      <h1>404 ... </h1>
      <IconMicrophoneOff size={32} />
      <p>No Mics Found</p>
    </div>
  );

  if (error) {
    return renderError();
  }

  if (isError) return renderError();

  return (
    <MicListingContext.Provider
      value={{
        mics: data,
        refetch,
        getQuery,
        clearQuery,
        setPagination,
        setQuery,
        params,
        error,
        isLoading,
      }}
    >
      {children}
    </MicListingContext.Provider>
  );
};

type MicListingContextState = {
  mics?: any;
  refetch?: any;
  error?: any;
  isLoading: any;
  params?: any;
  page?: number;
  endPage?: number;
  totalMics?: number;
  clearQuery?: ClearQuery;
  getQuery?: GetQuery;
  setQuery?: SetQuery;
  setPagination?: SetPagination;
};

type MicListingContextProps = {
  children: React.ReactNode;
};

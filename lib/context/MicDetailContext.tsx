'use client';

import { createContext } from 'react';
import { usePathname } from 'next/navigation';
import { ClearQuery, GetQuery, SetQuery } from '../hooks/useQuery';
import { useIndividualMics } from '../hooks/useIndividualMics';

export const MicDetailContext = createContext<MicDetailContextState>({
  mics: undefined,
  clearQuery: () => null,
  getQuery: () => null,
  setQuery: () => null,
  isLoading: false,
});

export const MicDetailContextProvider = ({ children }: MicDetailContextProps) => {
  const pathname = usePathname();

  const search = {
    id: pathname.split('/')[2],
  };

  const { data, isLoading, isError } = useIndividualMics(search);

  // console.log('Mic Detail Context Works', data);

  // if (!isLoading && !data?.mics) {
  //   <div className="p-32 flex flex-col">
  //     <h1>404 ... </h1>
  //     <TbMicrophoneOff size={32} />
  //     <p>No Mics Found</p>
  //   </div>;
  // }

  // if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching mic</div>;

  return (
    <MicDetailContext.Provider value={{ mics: data, isLoading }}>
      {children}
    </MicDetailContext.Provider>
  );
};

type MicDetailContextState = {
  // clearQuery: ClearQuery;
  mics?: any;
  refetch?: any;
  // setQuery: SetQuery;
  // getQuery: GetQuery;
  params?: any;
  currentPage?: number;
  endPage?: number;
  totalMics?: number;
  clearQuery?: ClearQuery;
  getQuery?: GetQuery;
  setQuery?: SetQuery;
  isLoading: any;
};

type MicDetailContextProps = {
  children: React.ReactNode;
};

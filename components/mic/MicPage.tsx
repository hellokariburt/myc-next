'use client';

import { useContext } from 'react';
import { Container, Loader } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import '@mantine/core/styles.css';
// import { TbMicrophoneOff } from 'react-icons/tb';

import { MicDetailContext } from '@/lib/context/MicDetailContext';
import changeTime from '@/lib/utils/changeTime';
// import { BackButton } from '../buttons/BackButton';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import NoMicFound from '../not-found/NoMicFound';
import MicHosts from './MicHosts';

const MicPage = () => {
  const { mics, isLoading } = useContext(MicDetailContext);

  if (isLoading || !mics) {
    return (
      <div className="flex pt-36 justify-center min-h-[100vh]">
        <Loader color="blue" />
      </div>
    );
  }

  if (mics?.totalMics === 0) {
    return (
      <div className="flex pt-36 justify-center">
        <NoMicFound />
      </div>
    );
  }

  if (mics.mic === null) {
    return (
      <div className="flex justify-center pt-36">
        <NoMicFound />
      </div>
    );
  }

  const { mic } = mics;

  return (
    <div className="flex flex-col gap-6 lg:w-[50%] w-auto py-32 min-w-[300px] lg:min-h-[100vh]  text-slate-700">
      <Container fluid className="flex flex-col-reverse md:flex-row p-3 pb-6 bg-white">
        <div className="flex flex-col pt-6 pl-0 lg:pl-2 pr-6 border-none md:border-[slate-500] md:border-solid border-r-2 text-base md:text-2xl ">
          <div className="flex flex-row md:flex-col">
            <p className="pr-1 font-bold pl-4 md:pl-0">{capitalizeDay(mic.day.toString())}</p>
            <p className="pr-1">{changeTime(mic?.start_time)}</p>
            <p className="font-semibold pt-6">{mic?.schedule}</p>
            <p className="font-semibold text-base md:text-xl">{mic?.mic_occurrence?.schedule}</p>
          </div>
          <div className="flex flex-col pt-2 pl-2 md:pl-0">
            <div className="flex flex-row text-green-700 text-base md:text-lg pl-2 md:pl-0">
              <p>Cost: </p>
              <p className="font-bold pl-1">
                {mic?.cost_id === 1 ? 'Free' : mic?.mic_cost.cost_amount}
              </p>
            </div>
            {mic.confirmed && (
              <div className="flex flex-row text-xs pt-5 pl-2 md:pl-0">
                <p className="font-bold">Confirmed: </p>
                <p className="pl-1">{mic.confirmed.slice(0, 10)}</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-col text-slate-700 text-4xl pt-5 px-4 ">
            <h1 className="font-bold text-blue-700">{mic?.name}</h1>
            <h5 className="text-base font-semibold pt-1">{mic?.mic_address.venue}</h5>
            <h6 className="text-base">{mic?.neighborhood}</h6>
          </div>

          <div className="flex flex-row gap-1 text-green-700 px-4 flex-wrap">
            {mic?.mic_address.unit_number ? (
              <p>{mic.mic_address.unit_number}</p>
            ) : null}
            <p>{mic?.mic_address.street_name},</p>
            <p className="font-semibold">{capitalizeDay(mic.borough.toString())}</p>
          </div>
          <MicHosts />
          <div className="flex flex-col px-4 pt-2">
            {mic?.signup_instructions && (
              <div className="flex pt-3">
                <p className="pr-1 font-bold">Signup: </p>
                <p>{mic?.signup_instructions.instructions}</p>
              </div>
            )}
            {mic?.email_address && (
              <div className="flex">
                <p className="font-bold pr-1">Email:</p>
                <p>{mic?.email_address}</p>
              </div>
            )}
            {mic?.instagram && (
              <div className="flex">
                <p className="font-bold pr-1">Instagram:</p>
                <p>{mic?.instagram}</p>
              </div>
            )}
            {mic?.website && (
              <div className="flex text-base">
                <p className="pl-16 text-blue-600 font-semibold items-center">
                  <a
                    className="underline decoration-dashed hover:decoration-solid flex gap-1 items-center"
                    href={mic?.website}
                  >
                    View Website
                    <IconExternalLink size="20px" />
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MicPage;

export type MicPageProps = {
  mics?: any;
};

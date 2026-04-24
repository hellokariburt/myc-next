import { useContext } from 'react';
import { IconBrandInstagram, IconMail } from '@tabler/icons-react';
import { MicDetailContext } from '@/lib/context/MicDetailContext';

const MicHosts = () => {
  const { mics } = useContext(MicDetailContext);

  const hostLoop = mics?.mic?.host_mics?.map((x: any, index: any) => (
    <div key={index}>
      <p key={index}>{x.mic_host.first_host}</p>
      {x.mic_host.email && (
        <div className="flex gap-1 text-sm items-center">
          <IconMail size="20px" />
          <p key={index}>{x.mic_host.email}</p>
        </div>
      )}
      {x.mic_host.instagram && (
        <div className="flex gap-1 text-sm items-center">
          <IconBrandInstagram size="20px" />
          <p key={index}>{x.mic_host.instagram}</p>
        </div>
      )}
    </div>
  ));

  return (
    <div>
      {hostLoop && hostLoop.length > 0 && (
        <div className="flex flex-row px-4 pt-3 text-base">
          <p className="pr-1 font-bold">Hosts: </p>
          <div>{hostLoop}</div>
        </div>
      )}
    </div>
  );
};

export default MicHosts;

import { IconBrandInstagram, IconMail } from '@tabler/icons-react';
import { MicDetail } from '@/lib/types/mic';

const MicHosts = ({ mic }: { mic: MicDetail }) => {
  const hosts = mic?.host_mics;

  if (!hosts || hosts.length === 0) {
    return null;
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide shrink-0">Hosts</span>
      <div className="flex flex-col gap-1">
        {hosts.map((x, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2 text-slate-700">
            <span>{x.mic_host.first_host}</span>
            {x.mic_host.email && (
              <a
                href={`mailto:${x.mic_host.email}`}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 text-sm"
              >
                <IconMail size={14} aria-hidden="true" />
                {x.mic_host.email}
              </a>
            )}
            {x.mic_host.instagram && (
              <a
                href={`https://instagram.com/${x.mic_host.instagram.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 text-sm"
              >
                <IconBrandInstagram size={14} aria-hidden="true" />
                {x.mic_host.instagram}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicHosts;

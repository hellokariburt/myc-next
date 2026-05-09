import { IconBrandInstagram, IconMail } from '@tabler/icons-react';
import { MicDetail } from '@/lib/types/mic';
import extractHandles from '@/lib/utils/extractHandles';

const MicHosts = ({ mic, labelClass }: { mic: MicDetail; labelClass?: string }) => {
  const hosts = mic?.host_mics;

  if (!hosts || hosts.length === 0) {
    return null;
  }

  const dt = labelClass ?? 'text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0';

  return (
    <>
      <dt className={`${dt} pt-0.5`}>Hosts</dt>
      <dd className="flex flex-col gap-2">
        {hosts.map((x, index) => (
          <div key={index} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-800">
            <span className="font-medium">{x.mic_host.first_host}</span>
            {x.mic_host.email && (
              <a
                href={`mailto:${x.mic_host.email}`}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline underline-offset-2 text-sm"
              >
                <IconMail size={14} aria-hidden="true" />
                {x.mic_host.email}
              </a>
            )}
            {x.mic_host.instagram && extractHandles(x.mic_host.instagram).map((handle) => (
              <a
                key={handle}
                href={`https://instagram.com/${handle.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline underline-offset-2 text-sm"
              >
                <IconBrandInstagram size={14} aria-hidden="true" />
                @{handle.replace(/^@/, '')}
              </a>
            ))}
          </div>
        ))}
      </dd>
    </>
  );
};

export default MicHosts;

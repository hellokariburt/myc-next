import { ImageResponse } from 'next/og';
import { getMic } from '@/lib/services/mics.service';
import { serialize } from '@/lib/utils/serialize';
import { MicDetail } from '@/lib/types/mic';

export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const boroughColors: Record<string, string> = {
  manhattan: '#2563EB',
  brooklyn: '#9333EA',
  queens: '#EA580C',
  bronx: '#E11D48',
  'staten-island': '#0D9488',
};

function formatTime(timeStr: string): string {
  const parts = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!parts) return timeStr;
  const h = parseInt(parts[1], 10);
  const m = parts[2];
  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m}${period}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let mic: MicDetail | null = null;
  try {
    const raw = await getMic(BigInt(id));
    if (raw) mic = serialize(raw) as unknown as MicDetail;
  } catch {
    // fall through to fallback
  }

  if (!mic) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: '#1E293B', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 800 }}>
          <span>Open</span>
          <span style={{ background: 'linear-gradient(to right, #3B82F6, #F97316)', backgroundClip: 'text', color: 'transparent' }}>MYC</span>
        </div>
      ),
      { ...size }
    );
  }

  const borough = mic.borough ?? '';
  const accentColor = boroughColors[borough.toLowerCase()] ?? '#2563EB';
  const time = mic.start_time ? formatTime(mic.start_time) : '';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#1E293B',
          color: 'white',
          padding: '60px',
        }}
      >
        {/* Top: brand */}
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, marginBottom: '40px' }}>
          <span>Open</span>
          <span style={{ color: '#F97316' }}>MYC</span>
        </div>

        {/* Middle: mic info */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', maxWidth: '1000px' }}>
            {mic.name}
          </div>
          <div style={{ fontSize: 28, color: '#94A3B8', marginBottom: '16px' }}>
            {mic.mic_address?.venue}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: 24 }}>
            {mic.day && (
              <div
                style={{
                  display: 'flex',
                  background: accentColor,
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}
              >
                {capitalize(mic.day)}s
              </div>
            )}
            {time && (
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}
              >
                {time}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                background: mic.mic_cost?.cost_amount?.toLowerCase().includes('free') ? '#16A34A' : 'rgba(255,255,255,0.1)',
                padding: '8px 20px',
                borderRadius: '999px',
                fontWeight: 600,
              }}
            >
              {mic.mic_cost?.cost_amount || 'Free'}
            </div>
          </div>
        </div>

        {/* Bottom: borough */}
        <div style={{ display: 'flex', fontSize: 22, color: accentColor, fontWeight: 700 }}>
          {borough ? capitalize(borough) : 'NYC'} — findopenmyc.com
        </div>
      </div>
    ),
    { ...size }
  );
}

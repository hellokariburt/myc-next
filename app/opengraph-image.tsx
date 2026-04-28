import { ImageResponse } from 'next/og';
import prisma from '@/lib/prisma';

export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const micCount = await prisma.mics.count();

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
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, marginBottom: '16px' }}>
          <span>Open</span>
          <span style={{ background: 'linear-gradient(to right, #3B82F6, #F97316)', backgroundClip: 'text', color: 'transparent' }}>MYC</span>
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#94A3B8', marginBottom: '40px', textAlign: 'center' }}>
          NYC Open Mic Search
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: 24 }}>
          <div style={{ display: 'flex', background: '#2563EB', padding: '12px 24px', borderRadius: '999px', fontWeight: 600 }}>
            {micCount}+ mics
          </div>
          <div style={{ display: 'flex', background: '#9333EA', padding: '12px 24px', borderRadius: '999px', fontWeight: 600 }}>
            5 boroughs
          </div>
          <div style={{ display: 'flex', background: '#16A34A', padding: '12px 24px', borderRadius: '999px', fontWeight: 600 }}>
            Free to use
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 20, color: '#64748B', marginTop: '40px' }}>
          findopenmyc.com
        </div>
      </div>
    ),
    { ...size }
  );
}

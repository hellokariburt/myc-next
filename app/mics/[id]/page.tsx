import { notFound } from 'next/navigation';
import { getMic } from '@/lib/services/mics.service';
import { serialize } from '@/lib/utils/serialize';
import { MicDetail } from '@/lib/types/mic';
import PageLayout from '@/components/pagelayout/PageLayout';
import MicPage from '@/components/mic/MicPage';
import MicIndividualMapLoad from '@/components/map/MicIndividualMapLoad';

export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  let id: bigint;
  try {
    id = BigInt(rawId);
  } catch {
    notFound();
  }

  if (id <= BigInt(0)) {
    notFound();
  }

  const raw = await getMic(id);

  if (!raw) {
    notFound();
  }

  const mic = serialize(raw) as unknown as MicDetail;

  return (
    <PageLayout hasBackButton className="pb-16 bg-[#F5F5F5] bg-cover h-full">
      <MicPage mic={mic} />
      <MicIndividualMapLoad mic={mic} />
    </PageLayout>
  );
}

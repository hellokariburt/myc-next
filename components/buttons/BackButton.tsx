'use client';

import { useRouter } from 'next/navigation';
import { TbArrowLeft } from 'react-icons/tb';

export function BackButton() {
  const router = useRouter();

  return (
    <div className="h-[rem(50px)] mb-[rem(120px)] fixed w-[100%] z-10 bg-white border-2 -mt-2 p-2">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-full text-sm transition-colors"
      >
        <TbArrowLeft size={20} />
        Back to listings
      </button>
    </div>
  );
}

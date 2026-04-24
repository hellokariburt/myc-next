'use client';

import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { TbArrowLeft } from 'react-icons/tb';

export function BackButton() {
  const router = useRouter();

  return (
    <div className="h-[rem(50px)] mb-[rem(120px)] fixed w-[100%] z-10 bg-white border-2 -mt-2 p-2">
      <Button
        onClick={() => router.back()}
        size="compact-md"
        radius="xl"
        leftSection={<TbArrowLeft size={20} />}
      >
        Back to listings
      </Button>
    </div>
  );
}

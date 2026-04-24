import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export function BackButton() {
  return (
    <Link
      href="/mics"
      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium py-1 text-sm transition-colors"
    >
      <IconArrowLeft size={18} />
      Back to listings
    </Link>
  );
}

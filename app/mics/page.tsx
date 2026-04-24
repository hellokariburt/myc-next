import { Suspense } from 'react';
import { MicListingPage2 } from '../../components/miclistingpage/MicListingPage';

export default function Page() {
  return (
    <Suspense>
      <MicListingPage2 />
    </Suspense>
  );
}

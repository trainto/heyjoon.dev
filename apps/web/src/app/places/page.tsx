import Main from '@/components/places/main';
import { Suspense } from 'react';

export default function Places() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

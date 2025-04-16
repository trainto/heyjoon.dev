import { fetcher } from '@/lib/api/fetchers';
import { PropsWithChildren, ReactNode, Suspense } from 'react';
import useSWR, { Key } from 'swr';

type Props = {
  swrKey: Key;
  revalidation?: boolean;
  loading?: ReactNode;
  fallbackData?: unknown;
};

const Fetcher = ({
  swrKey,
  revalidation,
  loading,
  fallbackData,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Suspense fallback={loading ?? <div className="flex justify-center h-full">Loading...</div>}>
      <FetcherInner swrKey={swrKey} revalidation={revalidation} fallbackData={fallbackData}>
        {children}
      </FetcherInner>
    </Suspense>
  );
};

const FetcherInner = ({
  swrKey,
  revalidation = true,
  fallbackData,
  children,
}: PropsWithChildren<Props>) => {
  useSWR(swrKey, fetcher, {
    suspense: true,
    revalidateOnFocus: revalidation,
    revalidateOnReconnect: revalidation,
    fallbackData,
  });

  return <>{children}</>;
};

export default Fetcher;

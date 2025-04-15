import { fetcher } from '@/lib/api/fetchers';
import { PropsWithChildren, Suspense } from 'react';
import useSWR, { Key } from 'swr';
import Loading from '../places/loading';

type Props = {
  swrKey: Key;
  revalidation?: boolean;
  fallbackData?: unknown;
};

const Fetcher = ({ swrKey, revalidation, fallbackData, children }: PropsWithChildren<Props>) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-8">
          <Loading />
        </div>
      }
    >
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

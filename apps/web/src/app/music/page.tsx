'use client';

import Button from '@/components/common/button';
import { fetcher, sendRequest } from '@/lib/api/fetchers';
import { useScrollHitTheBottom } from '@/lib/hooks';
import { dispatch } from '@/lib/store';
import { useCallback, useRef, useState } from 'react';

const CopyUrlButton = ({ videoId }: { videoId: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button color="zinc" onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy URL'}
    </Button>
  );
};

const handleFetchError = (err: unknown) => {
  if ((err as { status?: number })?.status === 429) {
    dispatch('modal', { msg: 'Too many requests. Please try again in a moment.' });
  }
};

const DownloadButton = ({ videoId }: { videoId: string }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const res = await sendRequest({
        method: 'POST',
        url: '/music/download',
        data: { url: `https://www.youtube.com/watch?v=${videoId}` },
      });

      if (res.status === 429) {
        dispatch('modal', { msg: 'Too many requests. Please try again in a moment.' });
      } else if (res.status !== 200) {
        dispatch('modal', { msg: 'Failed to download. Please try again.' });
      } else {
        dispatch('modal', { msg: 'Download complete!' });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? 'Downloading...' : 'Download'}
    </Button>
  );
};

type Category = 'music' | 'all';

export default function Music() {
  const [category, setCategory] = useState<Category>('music');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<MusicVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const queryRef = useRef<{ q: string; category: Category } | undefined>(undefined);
  const nextPageTokenRef = useRef<string | undefined>(undefined);

  const handleSearch = async () => {
    const q = search.trim();

    if (q === '') {
      return;
    }

    queryRef.current = { q, category };
    nextPageTokenRef.current = undefined;

    setIsLoading(true);

    try {
      const data = await fetcher<MusicSearchResult>('/music', { q, category });
      setResults(data.items);
      nextPageTokenRef.current = data.nextPageToken;
    } catch (err) {
      handleFetchError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!queryRef.current || !nextPageTokenRef.current || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetcher<MusicSearchResult>('/music', {
        ...queryRef.current,
        pageToken: nextPageTokenRef.current,
      });
      setResults((prev) => {
        const existingIds = new Set(prev.map((v) => v.videoId));
        return [...prev, ...data.items.filter((v) => !existingIds.has(v.videoId))];
      });
      nextPageTokenRef.current = data.nextPageToken;
    } catch (err) {
      handleFetchError(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useScrollHitTheBottom(handleLoadMore);

  const handleRowClick = (v: MusicVideo) => {
    dispatch('layer', {
      node: (
        <div>
          <iframe
            src={`https://www.youtube.com/embed/${v.videoId}?autoplay=1`}
            className="w-full aspect-video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />

          <div className="flex justify-end items-center space-x-2 mt-3">
            <CopyUrlButton videoId={v.videoId} />
            <DownloadButton videoId={v.videoId} />
          </div>
        </div>
      ),
      containerClassName: 'w-full sm:w-[640px]',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center space-x-5">
        <button
          className={`text-lg font-bold ${
            category === 'music' ? 'text-brand2-animation' : 'text-gray-300-animation'
          }`}
          onClick={() => setCategory('music')}
        >
          Music
        </button>

        <span className="text-gray-500">|</span>

        <button
          className={`text-lg font-bold ${
            category === 'all' ? 'text-brand2-animation' : 'text-gray-300-animation'
          }`}
          onClick={() => setCategory('all')}
        >
          전체
        </button>
      </div>

      <div className="px-5 mt-3">
        <div className="flex w-full rounded-md border border-gray-700 items-center">
          <input
            className="bg-bg-main p-2 text-gray-400 text-sm min-w-0 w-full"
            placeholder="Search videos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <div
            role="button"
            className="p-2 px-4 border-l border-gray-700 text-gray-400"
            onClick={handleSearch}
          >
            Search
          </div>
        </div>
      </div>

      <div className="px-5 mt-3 space-y-2">
        {results.map((v) => (
          <div
            key={v.videoId}
            role="button"
            className="flex items-center space-x-3"
            onClick={() => handleRowClick(v)}
          >
            <img src={v.thumbnail} alt={v.title} className="w-24 h-auto rounded-md" />
            <div className="min-w-0">
              <div className="text-sm truncate">{v.title}</div>
              <div className="text-xs text-gray-500 truncate">{v.channelTitle}</div>
            </div>
          </div>
        ))}

        {isLoading && <div className="text-gray-500 text-sm">Loading...</div>}
      </div>
    </div>
  );
}

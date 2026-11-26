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

const EditTrackForm = ({
  track,
  onSaved,
  onDeleted,
}: {
  track: LibraryTrack;
  onSaved: (track: LibraryTrack) => void;
  onDeleted: (id: string) => void;
}) => {
  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [album, setAlbum] = useState(track.album);
  const [albumartist, setAlbumartist] = useState(track.albumartist);
  const [year, setYear] = useState(track.year);
  const [mbAlbumId, setMbAlbumId] = useState(track.mbAlbumId);
  const [disc, setDisc] = useState(track.disc);
  const [disctotal, setDisctotal] = useState(track.disctotal);
  const [trackNo, setTrackNo] = useState(track.track);
  const [tracktotal, setTracktotal] = useState(track.tracktotal);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const edits: LibraryTrackEdits = {};
    if (title.trim() !== track.title) edits.title = title.trim();
    if (artist.trim() !== track.artist) edits.artist = artist.trim();
    if (album.trim() !== track.album) edits.album = album.trim();
    if (albumartist.trim() !== track.albumartist) edits.albumartist = albumartist.trim();
    if (year.trim() !== track.year) edits.year = year.trim();
    if (mbAlbumId.trim() !== track.mbAlbumId) edits.mbAlbumId = mbAlbumId.trim();
    if (disc.trim() !== track.disc) edits.disc = disc.trim();
    if (disctotal.trim() !== track.disctotal) edits.disctotal = disctotal.trim();
    if (trackNo.trim() !== track.track) edits.track = trackNo.trim();
    if (tracktotal.trim() !== track.tracktotal) edits.tracktotal = tracktotal.trim();

    if (Object.keys(edits).length === 0) {
      dispatch('layer', null);
      return;
    }

    setIsSaving(true);

    try {
      const res = await sendRequest({
        method: 'PATCH',
        url: `/music/library/${track.id}`,
        data: edits,
      });

      if (res.status !== 200) {
        dispatch('modal', { msg: 'Failed to save. Please try again.' });
        return;
      }

      onSaved({ ...track, ...edits });
      dispatch('layer', null);
    } finally {
      setIsSaving(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    dispatch('modal', {
      msg: 'Are you sure you want to delete this track? This cannot be undone.',
      hasCancel: true,
      onConfirm: async () => {
        setIsDeleting(true);

        try {
          const res = await sendRequest({
            method: 'DELETE',
            url: `/music/library/${track.id}`,
          });

          if (res.status !== 200) {
            dispatch('modal', { msg: 'Failed to delete. Please try again.' });
            return;
          }

          onDeleted(track.id);
          dispatch('layer', null);
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  return (
    <div className="flex flex-col max-h-[70vh]">
      <div className="space-y-3 overflow-y-auto">
        <div>
          <div className="text-xs text-gray-500 mb-1">Title</div>
          <input
            className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Artist</div>
          <input
            className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Album</div>
          <input
            className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
          />
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Album Artist</div>
          <input
            className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
            value={albumartist}
            onChange={(e) => setAlbumartist(e.target.value)}
          />
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Year</div>
          <input
            className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
            placeholder="e.g. 2024 (leave empty to clear)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">MusicBrainz Album Id</div>
          <input
            className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
            placeholder="leave empty to clear"
            value={mbAlbumId}
            onChange={(e) => setMbAlbumId(e.target.value)}
          />
        </div>

        <div className="flex space-x-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Disc</div>
            <input
              className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
              placeholder="e.g. 1"
              value={disc}
              onChange={(e) => setDisc(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Disc Total</div>
            <input
              className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
              placeholder="e.g. 1"
              value={disctotal}
              onChange={(e) => setDisctotal(e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Track No.</div>
            <input
              className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
              placeholder="e.g. 1"
              value={trackNo}
              onChange={(e) => setTrackNo(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Track Total</div>
            <input
              className="bg-bg-main border border-gray-700 rounded-md p-2 text-sm w-full"
              placeholder="e.g. 10"
              value={tracktotal}
              onChange={(e) => setTracktotal(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-2 pt-3">
        <Button color="red" onClick={handleDelete} disabled={isDeleting || isSaving}>
          Delete
        </Button>
        <Button onClick={handleSave} disabled={isSaving || isDeleting}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

type Tab = 'youtube' | 'library';

export default function Music() {
  const [tab, setTab] = useState<Tab>('youtube');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<MusicVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const queryRef = useRef<string | undefined>(undefined);
  const nextPageTokenRef = useRef<string | undefined>(undefined);
  const requestGenRef = useRef(0);

  const handleSearch = async () => {
    const q = search.trim();

    if (q === '') {
      return;
    }

    queryRef.current = q;
    nextPageTokenRef.current = undefined;

    requestGenRef.current += 1;
    const gen = requestGenRef.current;
    setIsLoading(true);

    try {
      const data = await fetcher<MusicSearchResult>('/music', { q, category: 'music' });
      if (gen !== requestGenRef.current) return;
      setResults(data.items);
      nextPageTokenRef.current = data.nextPageToken;
    } catch (err) {
      if (gen !== requestGenRef.current) return;
      handleFetchError(err);
    } finally {
      if (gen === requestGenRef.current) setIsLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (tab !== 'youtube' || !queryRef.current || !nextPageTokenRef.current || isLoading) {
      return;
    }

    const gen = requestGenRef.current;
    setIsLoading(true);

    try {
      const data = await fetcher<MusicSearchResult>('/music', {
        q: queryRef.current,
        category: 'music',
        pageToken: nextPageTokenRef.current,
      });
      if (gen !== requestGenRef.current) return;
      setResults((prev) => {
        const existingIds = new Set(prev.map((v) => v.videoId));
        return [...prev, ...data.items.filter((v) => !existingIds.has(v.videoId))];
      });
      nextPageTokenRef.current = data.nextPageToken;
    } catch (err) {
      if (gen !== requestGenRef.current) return;
      handleFetchError(err);
    } finally {
      if (gen === requestGenRef.current) setIsLoading(false);
    }
  }, [isLoading, tab]);

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

  const [libraryResults, setLibraryResults] = useState<LibraryTrack[]>([]);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);

  const handleLibrarySearch = async () => {
    requestGenRef.current += 1;
    const gen = requestGenRef.current;
    setIsLibraryLoading(true);

    try {
      const data = await fetcher<LibraryTrack[]>('/music/library', { q: search.trim() });
      if (gen !== requestGenRef.current) return;
      setLibraryResults(data);
    } catch (err) {
      if (gen !== requestGenRef.current) return;
      handleFetchError(err);
    } finally {
      if (gen === requestGenRef.current) setIsLibraryLoading(false);
    }
  };

  const handleLibraryRowClick = (track: LibraryTrack) => {
    dispatch('layer', {
      node: (
        <EditTrackForm
          track={track}
          onSaved={(updated) => {
            setLibraryResults((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          }}
          onDeleted={(id) => {
            setLibraryResults((prev) => prev.filter((t) => t.id !== id));
          }}
        />
      ),
      containerClassName: 'w-full sm:w-96',
    });
  };

  const handleTabChange = (next: Tab) => {
    requestGenRef.current += 1;
    setTab(next);
    setSearch('');
    setResults([]);
    setLibraryResults([]);
    setIsLoading(false);
    setIsLibraryLoading(false);
    queryRef.current = undefined;
    nextPageTokenRef.current = undefined;
  };

  return (
    <div>
      <div className="flex items-center justify-center space-x-5">
        <button
          className={`text-lg font-bold ${
            tab === 'youtube' ? 'text-brand2-animation' : 'text-gray-300-animation'
          }`}
          onClick={() => handleTabChange('youtube')}
        >
          YouTube
        </button>

        <span className="text-gray-500">|</span>

        <button
          className={`text-lg font-bold ${
            tab === 'library' ? 'text-brand2-animation' : 'text-gray-300-animation'
          }`}
          onClick={() => handleTabChange('library')}
        >
          Library
        </button>
      </div>

      <div className="px-5 mt-3">
        <div className="flex w-full rounded-md border border-gray-700 items-center">
          <input
            className="bg-bg-main p-2 text-gray-400 text-sm min-w-0 w-full"
            placeholder={tab === 'youtube' ? 'Search videos' : 'Search library'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                tab === 'youtube' ? handleSearch() : handleLibrarySearch();
              }
            }}
          />
          <div
            role="button"
            className="p-2 px-4 border-l border-gray-700 text-gray-400"
            onClick={tab === 'youtube' ? handleSearch : handleLibrarySearch}
          >
            Search
          </div>
        </div>
      </div>

      {tab === 'youtube' ? (
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
      ) : (
        <div className="px-5 mt-3 space-y-2">
          {libraryResults.map((track) => (
            <div
              key={track.id}
              role="button"
              className="py-1"
              onClick={() => handleLibraryRowClick(track)}
            >
              <div className="text-sm truncate">{track.title}</div>
              <div className="text-xs text-gray-500 truncate">
                {track.artist}
                {track.album ? ` — ${track.album}` : ''}
              </div>
            </div>
          ))}

          {isLibraryLoading && <div className="text-gray-500 text-sm">Loading...</div>}
        </div>
      )}
    </div>
  );
}

import { fetcher, sendRequest } from '@/lib/api/fetchers';
import { format } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import Button from '../button';
import Avatar from './avatar';

export default function Comments({ place }: { place: Place }) {
  const [newComment, setNewComment] = useState('');

  const { data: comments, mutate } = useSWR<CommentInfo[]>('/places/comments/' + place.id, fetcher);

  const canPost = useMemo(() => newComment.length >= 3, [newComment.length]);

  const contentDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (comments == null) {
      return;
    }

    const container = document.querySelector('.layer-container');
    if (container == null || contentDiv.current == null) {
      return;
    }

    const height = container?.clientHeight - 30 - 30;
    contentDiv.current.style.height = height < 320 ? '320px' : height + 'px';
  }, [comments]);

  const onPost = useCallback(async () => {
    const res = await sendRequest({
      method: 'POST',
      url: '/places/comments/' + place.id,
      data: { comment: newComment.trim() },
    });

    if (res.status === 200) {
      setNewComment('');
      mutate();
    }
  }, [mutate, newComment, place.id]);

  return (
    <div className="text-sm relative pb-20" ref={contentDiv}>
      <div className="h-full overflow-y-auto dark-scroller px-2">
        {comments && comments.map((c) => <CommentMemo key={c.id} commentInfo={c} />)}
      </div>

      <div className="absolute bottom-0 w-full">
        <input
          className="w-full bg-bg-main border-b p-1"
          placeholder="Your comment"
          maxLength={100}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value.slice(0, 100))}
        />

        <div className="flex justify-end mt-2">
          <Button color="indigo" size="sm" onClick={onPost} disabled={!canPost}>
            Post
          </Button>
        </div>
      </div>

      <style jsx>{`
        input {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}

const Comment = ({ commentInfo }: { commentInfo: CommentInfo }) => {
  return (
    <div className="flex space-x-2 comment mt-3">
      <div>
        <Avatar src={commentInfo.avatar} size={28} />
      </div>
      <div>
        <div className="flex text-xs">
          <div className="text-gray-400">@{commentInfo.nickname}</div>
          <div className="text-gray-500 ml-3">{format(commentInfo.createdAt, 'MMM dd, yyyy')}</div>
        </div>

        <div className="mt-1">{commentInfo.comment}</div>
      </div>
    </div>
  );
};

const CommentMemo = memo(Comment);

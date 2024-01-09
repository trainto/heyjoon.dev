import { sendRequest } from '@/lib/api/fetchers';
import { useCallback, useMemo, useState } from 'react';
import Button from '../button';

export default function Comments({ place }: { place: Place }) {
  const [newComment, setNewComment] = useState('');

  const canPost = useMemo(() => newComment.length > 3, [newComment.length]);

  const onPost = useCallback(async () => {
    const res = await sendRequest({
      method: 'POST',
      url: '/places/comments/' + place.id,
      data: { comment: newComment.trim() },
    });

    if (res.status === 200) {
      setNewComment('');
    }
  }, [newComment, place.id]);

  return (
    <div className="text-sm">
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

      <style jsx>{`
        input {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}

import { Posts } from '@/lib/utils';
import Link from 'next/link';
import Me from './components/me';
import { format } from 'date-fns';

export default function Home() {
  const posts = Posts.getAllPosts();

  return (
    <div className="flex">
      <div className="px-10">
        <Me />
      </div>

      <div className="px-10">
        {posts.map((post) => (
          <>
            <Link key={post.slug} as={`/posts/${post.slug}`} href="/posts/[slug].tsx">
              <div className="text-xl">{post.title}</div>
            </Link>
            {post.description && <div className="text text-gray-400">{post.description}</div>}
            <div className="text-sm text-gray-500">
              {format(new Date(post.date), 'MMM dd, yyyy')}
            </div>
            <br />
          </>
        ))}
      </div>
    </div>
  );
}

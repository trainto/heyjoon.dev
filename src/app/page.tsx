import { Posts } from '@/lib/utils';
import Link from 'next/link';
import Me from '../components/me';
import { format } from 'date-fns';

export default function Home() {
  const posts = Posts.getAllPosts();

  return (
    <div className="flex flex-col sm:flex-row justify-center">
      <div>
        <Me />
      </div>

      <div className="px-5 sm:px-10">
        {posts.map((post) => (
          <div key={post.slug}>
            <Link href={`/posts/${post.slug}`} prefetch={false}>
              <div className="text-xl text-brand1">{post.title}</div>
            </Link>
            <div className="text-sm text-gray-500">
              {format(new Date(post.date), 'MMM dd, yyyy')}
            </div>
            {post.description && <div className="text text-gray-400">{post.description}</div>}

            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

import { Posts } from '@/lib/utils';
import Link from 'next/link';
import Me from './components/me';

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
              {post.title}
            </Link>
            {post.description && <div>{post.description}</div>}
            <div>{post.date}</div>
            <br />
          </>
        ))}
      </div>
    </div>
  );
}

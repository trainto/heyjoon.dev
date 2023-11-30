import { Posts } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  const posts = Posts.getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Joon.log()</div>
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
    </main>
  );
}

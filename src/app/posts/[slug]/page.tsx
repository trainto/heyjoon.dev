import { Posts, markdownToHtml } from '@/lib/utils';
import { format } from 'date-fns';

export default async function Post({ params }: { params: { slug: string } }) {
  const post = Posts.getPost(params.slug);

  if (!post) {
    return <div>Oops...</div>;
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <article className="mt-10 px-5">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      {post.description && <h3 className="text-lg text-gray-400">{post.description}</h3>}
      <div className="text-sm text-gray-500 text-right">
        {format(new Date(post.date), 'MMM dd, yyyy')}
      </div>

      <div className="mt-10" dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
    </article>
  );
}

export function generateStaticParams() {
  const posts = Posts.getAllPosts();

  return posts.map((post) => post);
}

import { Posts, markdownToHtml } from '@/lib/utils';

export default async function Post({ params }: { params: { slug: string } }) {
  const post = Posts.getPost(params.slug);

  if (!post) {
    return <div>Oops...</div>;
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <article className="mt-10">
      <h2 className="text-3xl">{post.title}</h2>
      {post.description && <h3 className="text-lg text-gray-500">{post.description}</h3>}
      <div className="text-sm text-gray-500">{post.date}</div>

      <div className="mt-10" dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
    </article>
  );
}

export function generateStaticParams() {
  const posts = Posts.getAllPosts();

  return posts.map((post) => post);
}

import { Posts, markdownToHtml } from '@/lib/utils';

export default async function Post({ params }: { params: { slug: string } }) {
  const post = Posts.getPost(params.slug);

  if (!post) {
    return <div>Oops...</div>;
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
    </article>
  );
}

export function generateStaticParams() {
  const posts = Posts.getAllPosts();

  return posts.map((post) => post);
}

import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import { micromark } from 'micromark';

export const Posts = (() => {
  const postsDir = join(process.cwd(), 'posts');
  const slugs = fs.readdirSync(postsDir);
  const posts = slugs
    .filter((slug) => !slug.startsWith('WIP'))
    .map((slug) => {
      const fileContents = fs.readFileSync(join(postsDir, slug, 'index.md'), 'utf-8');
      const { data, content } = matter(fileContents);

      const post: PostType = {
        slug,
        content,
        title: data['title'],
        description: data['description'],
        date: data['date'],
      };

      return post;
    })
    .sort((a, b) => {
      const aDate = a.date.replaceAll(/\D/g, '');
      const bDate = b.date.replaceAll(/\D/g, '');
      if (aDate > bDate) {
        return -1;
      }

      return 0;
    });

  const getAllPosts = () => posts;

  const getPost = (slug: string) => {
    const post = posts.filter((p) => p.slug === slug);

    if (post.length === 1) {
      return post[0];
    }

    return false;
  };

  return { getAllPosts, getPost };
})();

export const markdownToHtml = (markdown: string) => {
  return micromark(markdown);
};

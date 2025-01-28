import { Posts } from '@/lib/utils';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2024.01.01');

  const siteMap = [
    {
      url: 'https://heyjoon.dev',
      lastModified: now,
    },
    {
      url: 'https://heyjoon.dev/about',
      lastModified: now,
    },
  ];

  const posts = Posts.getAllPosts();
  posts.forEach((p) =>
    siteMap.push({ url: 'https://heyjoon.dev/posts/' + p.slug, lastModified: new Date(p.date) }),
  );

  return siteMap;
}

export const dynamic = 'force-static';

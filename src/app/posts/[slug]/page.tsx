import { Posts, markdownToHtml } from '@/lib/utils';
import Prism from 'prismjs';
import { format } from 'date-fns';
import { Source_Code_Pro } from 'next/font/google';

import './prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-yaml';

const sourceCodePro = Source_Code_Pro({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default async function Post({ params }: { params: { slug: string } }) {
  const post = Posts.getPost(params.slug);

  if (!post) {
    return <div>Oops...</div>;
  }

  const contentHtml = await markdownToHtml(post.content);

  const processedContent = contentHtml.replace(
    /(<pre>\n*?\s*?<code class="language-(.*)">)([\s\S]*?)(<\/code>\n*?\s*?<\/pre>)/g,
    (wrapper, openingTags, language, codeSnippet, closingTags) => {
      if (Prism.languages[language]) {
        codeSnippet = codeSnippet.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        const snippet = Prism.highlight(codeSnippet, Prism.languages[language], language);

        return `${openingTags.replace(
          /<pre>/g,
          `<pre class="language-${language} ${sourceCodePro.className}">`,
        )}${snippet}${closingTags}`;
      }

      return wrapper;
    },
  );

  return (
    <article className="mt-10 px-5">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      {post.description && <h3 className="text-lg text-gray-400">{post.description}</h3>}
      <div className="text-sm text-gray-500 text-right">
        {format(new Date(post.date), 'MMM dd, yyyy')}
      </div>

      <div className="article_body mt-10" dangerouslySetInnerHTML={{ __html: processedContent }} />
    </article>
  );
}

export function generateStaticParams() {
  const posts = Posts.getAllPosts();

  return posts.map((post) => post);
}

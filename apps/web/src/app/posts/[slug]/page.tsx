import { Posts, markdownToHtml } from '@/lib/utils';
import { format } from 'date-fns';
import { Source_Code_Pro } from 'next/font/google';
import Prism from 'prismjs';

import './article.css';

import Ad from '@/components/common/ad';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import './prism-tomorrow.css';

const sourceCodePro = Source_Code_Pro({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const post = Posts.getPost((await params).slug);

  if (!post) {
    return <div>Oops...</div>;
  }

  const contentHtml = markdownToHtml(post.content);

  const processedContent = contentHtml.replace(
    /(<pre>\n*?\s*?<code class="language-(.*)">)([\s\S]*?)(<\/code>\n*?\s*?<\/pre>)/g,
    (_wrapper, openingTags, language, codeSnippet, closingTags) => {
      codeSnippet = codeSnippet.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      codeSnippet = Prism.languages[language]
        ? Prism.highlight(codeSnippet, Prism.languages[language], language)
        : codeSnippet;

      return `${openingTags.replace(
        /<pre>/g,
        `<pre class="language-${language} ${sourceCodePro.className}">`,
      )}${codeSnippet}${closingTags}`;
    },
  );

  return (
    <article className="mt-10 px-5 break-words">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      {post.description && <h3 className="text-lg text-gray-400">{post.description}</h3>}
      <div className="text-sm text-gray-500 text-right">
        {format(new Date(post.date), 'MMM dd, yyyy')}
      </div>

      <div className="article_body mt-10" dangerouslySetInnerHTML={{ __html: processedContent }} />

      <div className="my-4 overflow-hidden">
        <Ad slot="2054892003" />
      </div>
    </article>
  );
}

export function generateStaticParams() {
  const posts = Posts.getAllPosts();

  return posts.map((post) => post);
}

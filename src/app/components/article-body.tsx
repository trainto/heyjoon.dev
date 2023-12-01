'use client';

import Prism from 'prismjs';
import { useEffect } from 'react';
import { Source_Code_Pro } from 'next/font/google';

import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-java';

const sourceCodePro = Source_Code_Pro({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default function ArticleBody({ contentHtml }: { contentHtml: string }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <div className="article_body mt-10" dangerouslySetInnerHTML={{ __html: contentHtml }} />

      <style jsx global>{`
        code {
          font-family: ${sourceCodePro.style.fontFamily}!important;
          font-size: 0.9em !important;
        }
      `}</style>
    </>
  );
}

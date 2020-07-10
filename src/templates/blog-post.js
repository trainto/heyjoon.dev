import React, { useRef, useEffect } from 'react';
import { Link, graphql } from 'gatsby';
import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import './blog-post.css';
import Adsense from '../components/adsense';

const BlogPostTemplate = props => {
  const post = props.data.markdownRemark;
  const siteTitle = props.data.site.siteMetadata.title;
  const { previous, next } = props.pageContext;

  const refContent = useRef();
  const refAdRight = useRef();

  useEffect(() => {
    const rePosition = () => {
      const content = refContent.current;
      const adRight = refAdRight.current;
      if (!content || !adRight) {
        return;
      }

      const contentRight = content.offsetLeft + content.offsetWidth;
      adRight.style.left = contentRight + 100 + 'px';
    };

    rePosition();

    window.addEventListener('resize', rePosition);

    return () => window.removeEventListener('resize', rePosition);
  }, []);

  return (
    <>
      <div className="d-none d-xl-block fixed-top" style={{ top: 100, width: 160, height: 600 }}>
        <span className="position-relative" ref={refAdRight}>
          <Adsense slot="8329899743" style={{ display: 'inline-block', width: 160, height: 600 }} />
        </span>
      </div>

      <Layout location={props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />

        <div className="row justify-content-center">
          <header className="col-12 col-md-8" ref={refContent}>
            <h3>
              <Link to="/" style={{ textDecoration: 'none' }}>
                {siteTitle}
              </Link>
            </h3>
          </header>

          <div className="col-12 col-md-8 mt-3">
            <article>
              <header>
                <h1>{post.frontmatter.title}</h1>
                <p>{post.frontmatter.date}</p>
              </header>

              <section dangerouslySetInnerHTML={{ __html: post.html }} />

              <br />
              <Adsense format="horizontal" slot="4364348128" />

              <hr className="my-4" />
              <footer>
                <Bio />
              </footer>
            </article>

            <nav>
              <ul
                style={{
                  display: `flex`,
                  flexWrap: `wrap`,
                  justifyContent: `space-between`,
                  listStyle: `none`,
                  padding: 0
                }}
              >
                <li>
                  {previous && (
                    <Link to={previous.fields.slug} rel="prev">
                      ← {previous.frontmatter.title}
                    </Link>
                  )}
                </li>
                <li>
                  {next && (
                    <Link to={next.fields.slug} rel="next">
                      {next.frontmatter.title} →
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;

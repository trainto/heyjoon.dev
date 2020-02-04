import React from 'react';
import { Link, graphql } from 'gatsby';
import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import './blog-post.css';
import Adsense from '../components/adsense';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const { previous, next } = this.props.pageContext;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />

        <div className="row justify-content-center">
          <header className="col-12 col-md-8">
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

              <Adsense format="horizontal" slot="4364348128" />

              <section dangerouslySetInnerHTML={{ __html: post.html }} />

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
    );
  }
}

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

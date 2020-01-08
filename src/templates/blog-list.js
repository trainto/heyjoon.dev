import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Sidebar from '../components/sidebar';

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;

    const { currentPage, numPages } = this.props.pageContext;
    const hasNext = currentPage < numPages;
    const hasPrev = currentPage > 1;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />

        <div className="row justify-content-center">
          <div className="col-11 col-md-4 mt-3">
            <Sidebar />
          </div>

          <div className="col-12 col-md-8 mt-3 pl-md-5">
            {posts.map(({ node }) => {
              const title = node.frontmatter.title || node.fields.slug;
              return (
                <article key={node.fields.slug} className="mb-5">
                  <header>
                    <h3>
                      <Link style={{ boxShadow: 'none', textDecoration: 'none' }} to={node.fields.slug}>
                        {title}
                      </Link>
                    </h3>
                    <small>{node.frontmatter.date}</small>
                  </header>
                  <section className="mt-2">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: node.frontmatter.description || node.excerpt
                      }}
                    />
                  </section>
                </article>
              );
            })}

            <div className="d-flex justify-content-between pt-5" style={{ fontSize: '1.2rem' }}>
              <div>{hasPrev ? <Link to={`/${currentPage === 2 ? '' : currentPage - 1}`}>← Prev</Link> : null}</div>
              <div>{hasNext ? <Link to={`/${currentPage === 0 ? 1 : currentPage + 1}`}>→ Next</Link> : null}</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: $limit, skip: $skip) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;

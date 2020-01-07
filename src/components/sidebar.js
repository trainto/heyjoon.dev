import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

const Sidebar = () => {
  const data = useStaticQuery(graphql`
    query SidebarQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 96, height: 96, quality: 100) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter
          }
        }
      }
    }
  `);

  const { author } = data.site.siteMetadata;

  return (
    <div className="px-3">
      <Image
        className="shadow"
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          borderRadius: '100%'
        }}
      />

      <h1 className="mt-3" style={{ fontSize: '2rem' }}>
        Trainto.log()
      </h1>
      <h2 className="text-muted" style={{ fontSize: '1.2rem' }}>
        Hakjoon Sim
      </h2>

      <p className="text-muted">Developer who lives in Seoul. Like programming and doing nothing.</p>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import './sidebar.css';

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
      twitterLogo: file(absolutePath: { regex: "/twitter.png/" }) {
        childImageSharp {
          fixed(width: 28, height: 28, quality: 100) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      linkedinLogo: file(absolutePath: { regex: "/linkedin.png/" }) {
        childImageSharp {
          fixed(width: 28, height: 28, quality: 100) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      githubLogo: file(absolutePath: { regex: "/github.png/" }) {
        childImageSharp {
          fixed(width: 28, height: 28, quality: 100) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter
            linkedin
            github
          }
        }
      }
    }
  `);

  const { author, social } = data.site.siteMetadata;

  return (
    <div className="border-responsive">
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
        {author}
      </h2>

      <p className="text-muted">Developer who lives in Seoul. Like programming and doing nothing.</p>

      <a href="https://iam.trainto.me">About me</a>

      <div className="my-3">
        <a
          className="align-middle"
          href={`https://twitter.com/${social.twitter}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image fixed={data.twitterLogo.childImageSharp.fixed} alt="twitter" />
        </a>
        <a
          className="align-middle ml-3"
          href={`https://linkedin.com/in/${social.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image fixed={data.linkedinLogo.childImageSharp.fixed} alt="linkedin" />
        </a>
        <a
          className="align-middle ml-3"
          href={`https://github.com/${social.github}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image fixed={data.githubLogo.childImageSharp.fixed} alt="github" />
        </a>
      </div>
    </div>
  );
};

export default Sidebar;

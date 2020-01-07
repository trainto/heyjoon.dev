import React from 'react';
import { Link } from 'gatsby';
import Helmet from 'react-helmet';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    let header;

    if (location.pathname === rootPath) {
      header = (
        <h1>
          <Link to={`/`}>{title}</Link>
        </h1>
      );
    } else {
      header = (
        <h3>
          <Link to={`/`}>{title}</Link>
        </h3>
      );
    }

    return (
      <>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossorigin="anonymous"
          />
        </Helmet>

        <div className="container">
          <header>{header}</header>
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>
      </>
    );
  }
}

export default Layout;

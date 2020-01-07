import React from 'react';
import Helmet from 'react-helmet';

class Layout extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossorigin="anonymous"
          />
          <link href="https://fonts.googleapis.com/css?family=Noto+Sans&display=swap" rel="stylesheet" />
          <style type="text/css">{`
            body {
              background-color: #282c35;
              color: rgba(255, 255, 255, 0.88);
              font-family: 'Noto Sans', sans-serif;
            }

            a, a:hover {
              color: #e31b6d;
            }

            hr {
              background-color: rgba(255, 255, 255, 0.3);
            }
          `}</style>
        </Helmet>

        <div className="container py-3">
          <main>{children}</main>
        </div>
      </>
    );
  }
}

export default Layout;

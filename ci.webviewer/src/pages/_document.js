import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

export default class AppDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" type="image/x-icon" href="./static/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          {process.env.type === 'app'
            ? <script type="text/javascript" charset="utf-8" src="cordova.js"></script>
            : null
          }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
import "@babel/polyfill"
import React from 'react'

import Head from 'next/head'
import App, { Container } from 'next/app'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'

import { blue } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

import { appWithTranslation } from '../i18n'

import './index.css'

import { makeStore } from '../state/store'

const theme = createMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    type: "light",
    primary: blue
  },
  typography: {
    useNextVariants: true,
  }
})

class Base extends App {

  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    return { pageProps }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <React.Fragment>
        <Head><title>Continu Inzicht webviewer</title></Head>
        <Container>
          <Provider store={store}>
            <CssBaseline>
              <MuiThemeProvider theme={theme} >
                <Component {...pageProps} />
              </MuiThemeProvider>
            </CssBaseline>
          </Provider>
        </Container>
      </React.Fragment>
    )
  }
}

export default withRedux(makeStore, { debug: false })(appWithTranslation(Base))
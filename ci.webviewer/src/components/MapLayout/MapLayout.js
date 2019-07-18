import React from 'react'
import Head from 'next/head'

const leafletCss = 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.css'

const MapLayout = ({ children }) => (
  <React.Fragment>
    <Head>
      <link rel="stylesheet" href={ leafletCss } />
    </Head>
    { children }
  </React.Fragment>
)

export default MapLayout
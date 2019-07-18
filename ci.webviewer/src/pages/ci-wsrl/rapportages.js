import React from 'react'

import Rapportages from '../../components/Pages/Rapportages'

const Page = () => {
  return(
    <Rapportages appid={1} url={'/ci-wsrl'}/>
  )
}
Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

export default Page
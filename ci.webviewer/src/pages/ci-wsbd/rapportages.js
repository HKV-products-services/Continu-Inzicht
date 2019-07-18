import React from 'react'

import Rapportages from '../../components/Pages/Rapportages'

const Page = () => {
  return(
    <Rapportages appid={6} url={'/ci-wsbd'}/>
  )
}

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

  
export default Page
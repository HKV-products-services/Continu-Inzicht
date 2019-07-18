import React from 'react'

import Rapportages from '../../components/Pages/Rapportages'

const Page = () => {
  return(
    <Rapportages appid={5} url={'/ci-wrij'}/>
  )
}

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

  
export default Page
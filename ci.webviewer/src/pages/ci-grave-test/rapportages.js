import React from 'react'

import Rapportages from '../../components/Pages/Rapportages'

const Page = () => {
  return(
    <Rapportages appid={20} url={'/ci-grave-test'}/>
  )
}

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

  
export default Page
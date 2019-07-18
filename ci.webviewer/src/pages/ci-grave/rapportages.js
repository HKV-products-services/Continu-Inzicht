import React from 'react'

import Rapportages from '../../components/Pages/Rapportages'

const Page = () => {
  return(
    <Rapportages appid={19} url={'/ci-grave'}/>
  )
}

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

  
export default Page
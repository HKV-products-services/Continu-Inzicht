import React from 'react'

import Toelichting from '../../components/Pages/Toelichting'

const Page = () => {
  return ( 
    <Toelichting appid={8} url={'/ci-hhnk'}/>
  )
}

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}


export default Page
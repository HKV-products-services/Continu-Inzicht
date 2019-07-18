import React from 'react'

import ContinuInzichtHhnk from '../../components/Pages/ContinuInzicht-hhnk'

const Page = () => {
  return (
    <ContinuInzichtHhnk appid={8} url='/ci-hhnk' notifications={false}/>
  )
}

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}


export default Page
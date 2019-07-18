import React from 'react'

import ContinuInzicht from '../../components/Pages/ContinuInzicht'

const Page = () => (
  <ContinuInzicht appid={6} url='/ci-wsbd' notifications={false}/>
)

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

export default Page
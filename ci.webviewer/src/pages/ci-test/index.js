import React from 'react'

import ContinuInzicht from '../../components/Pages/ContinuInzicht'

const Page = () => {
  return (
    <ContinuInzicht appid={7} url='/ci-test' notifications={true}/>
  )
}

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

export default Page
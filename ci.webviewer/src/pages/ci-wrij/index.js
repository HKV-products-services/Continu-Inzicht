import React from 'react'

import ContinuInzicht from '../../components/Pages/ContinuInzicht'

const Page = () => (
  <ContinuInzicht appid={5} url='/ci-wrij' notifications={false}/>
)

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}


export default Page
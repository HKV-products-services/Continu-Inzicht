import React from 'react'

import ContinuInzicht from '../../components/Pages/ContinuInzicht'

const Page = () => (
  <ContinuInzicht appid={20} url='/ci-grave-test' notifications={false}/>
)

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

export default Page
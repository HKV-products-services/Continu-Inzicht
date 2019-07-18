import React from 'react'

import ContinuInzicht from '../../components/Pages/ContinuInzicht'

const Page = () => (
  <ContinuInzicht appid={19} url='/ci-grave' notifications={false}/>
)

Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

export default Page
import React from 'react'

import ContinuInzicht from '../../components/Pages/ContinuInzicht'

const Page = () => (
  <ContinuInzicht appid={1} url='/ci-wsrl' notifications={true}/>
)
Page.getInitialProps = () => {
  return {
    namespacesRequired: ['mangrove'],
  }
}

export default Page
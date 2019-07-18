import React from 'react'
import { createVega } from '../../lib/vegaUtils'

import { i18n, withNamespaces } from '../../i18n'

class HKVVega extends React.Component {
  constructor(props) {
    super(props)
    this.vegaRef = React.createRef()
  }

  componentDidMount() {
    const { application, specs, setView, options, t, id } = this.props
    let myId = id
    if (!myId) {
      myId = 'id-' + Math.random().toString(36).substr(2, 16)
    }
    if (application && specs) {
      let myOptions = {}
      if (options){
        myOptions = options
      }
      if (t) {
        myOptions.t = t
      }

      createVega(this.vegaRef.current, specs, setView, myOptions, myId)
    }
  }

  render() {
    return (
      <div ref={this.vegaRef} />
    )
  }
}

export default withNamespaces('mangrove')(HKVVega)

import React from 'react'

import { createMap } from '../../lib/mapUtils'

import './index.css'

class HKVMap extends React.Component {

  constructor(props) {
    super(props)
    this.mapRef = React.createRef()
  }

  componentDidMount() {
    const { application, setMap, myOptions, myKey } = this.props
    if (application) {
      createMap(this.mapRef.current, application.config, setMap, myOptions, myKey)
    }
  }

  render() {
    return <div className={this.props.className} ref={this.mapRef} />
  }
}

export default HKVMap
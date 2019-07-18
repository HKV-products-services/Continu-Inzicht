import React from 'react'

import { createMap } from '../../../lib/mapUtils'

import './index.css'

class LeafletMap extends React.Component {

  constructor(props) {
    super(props)
    this.mapRef = React.createRef()
  }

  componentDidMount() {
    const { application } = this.props
    if (application) {
      createMap(this.mapRef.current, application.config, this.props.initializeMap)
    }
  }

  render() {
    return (
      <div className={this.props.className} ref={this.mapRef}></div>
    )
  }
}

export default LeafletMap
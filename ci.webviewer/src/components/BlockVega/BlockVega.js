import React from 'react'
import dynamic from 'next/dynamic'
import { connect } from 'react-redux'

import asyncActions from '../../state/async-actions'

import ResizeObserver from 'react-resize-observer'

const HKVVega = dynamic(import('../HKVVega'), { ssr: false })

class BlockVega extends React.Component {
  render() {
    const { application, block, dialogs } = this.props
    const vegaSpec = application.config.vega.find(spec => spec.key === block.specName)
    if (vegaSpec) {
      // alleen uitvoeren wanneer dialog open is en wanneer er een vega spec in redux staat (deze wordt geleegd wanneer je een dialog sluit)
      if (dialogs.state && !this.props.vega.specs) {
        this.props.dispatch(asyncActions.getVegaSpecification(this.props.url, vegaSpec.specName))
          .then(spec => {
            vegaSpec.json = spec.specification
          })
      }
      return (
        <div style={{height: '100%'}}>
          <HKVVega
            application={application}
            setView={this.props.setView}
            specs={vegaSpec.json}
            options={block.options}
            id={block.options.key}
          />
          <ResizeObserver
            onResize={(rect) => {
              this.props.handleResize(rect.width, rect.height, vegaSpec, block.options.key)
            }}
          />
        </div>
      )
    }
  }
}

export default connect(state => state)(BlockVega)
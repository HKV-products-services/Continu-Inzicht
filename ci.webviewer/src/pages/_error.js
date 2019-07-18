import React from 'react'
import PropTypes from 'prop-types'

import { i18n, withNamespaces } from '../i18n'

import Typography from '@material-ui/core/Typography'

class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }

  render() {
    const { t } = this.props
    const image = '/static/images/Mangrove_logo.png'
    return (
      <div className='mangrove-container'>
        <img className='mangrove-image' src={ image }/>
        <Typography className='mangrove-tekst' variant="h5">
          {this.props.statusCode
            ? `An error ${this.props.statusCode} occurred on server`
            : 'An error occurred on client'
          }
        </Typography>
      </div>
    )
  }
}

Error.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces('mangrove')(Error)
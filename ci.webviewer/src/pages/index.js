import React from 'react'
import PropTypes from 'prop-types'

import { i18n, withNamespaces } from '../i18n'

import Typography from '@material-ui/core/Typography'

import './index.css'

class Page extends React.Component {

  render() {
    const { t } = this.props
    const image = '/static/images/ci-logo-rond.png'
    return (
      <div className='mangrove-container'>
        <img className='mangrove-image' src={ image }/>
        <Typography className='mangrove-tekst' variant="h5">{t('welcome')}</Typography>
      </div>
    )
  }
}

Page.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces('mangrove')(Page)
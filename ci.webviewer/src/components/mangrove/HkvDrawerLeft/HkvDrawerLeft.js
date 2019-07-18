import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Drawer from '@material-ui/core/Drawer'
import MenuHeader from '../MenuHeader'

const styles = theme => ({
  drawerPaper: {
    background: '#f5f5f5',
    boxShadow: '1px 0px 10px rgba(0,0,0,0.3)',
    [theme.breakpoints.up('xs')]: {
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      width: 360
    }
  },
  hidden: {
    transform: 'translateX(-600px) !important'
  }
})

class HkvDrawerLeft extends React.Component {

  render() {
    const { application, classes, drawers, onClose } = this.props
    
    if (!application.config.locale) return null

    const tooltip = `${application.config.name} | ${application.config.customer}`
    const logo = application.config.logo

    return (
      <Drawer
        anchor='left'
        variant='persistent'
        classes={drawers.left ? { paper: classes.drawerPaper } : { paper: `${classes.drawerPaper} ${classes.hidden}` }}
        open={drawers.left}
      >
        {application.config && <MenuHeader
          icon={<ChevronLeftIcon />}
          imageSrc={logo}
          onClick={onClose}
          titleText={application.config.name}
          tooltip={tooltip}
          type='left'
        />}
        {this.props.children}
      </Drawer>
    )
  }
}

HkvDrawerLeft = withStyles(styles, { withTheme: true })(HkvDrawerLeft)
export default connect(state => state)(HkvDrawerLeft)
import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Drawer from '@material-ui/core/Drawer'
import MenuAccordion from '../MenuAccordion'
import MenuHeader from '../MenuHeader'
import MenuList from '../MenuList'

import packageJson from '../../../package.json'

const styles = theme => ({
  drawerPaper: {
    background: '#f5f5f5',
    boxShadow: '1px 0px 10px rgba(0,0,0,0.3)',
    [theme.breakpoints.up('xs')]: {
      width: '95%'
    },
    [theme.breakpoints.up('sm')]: {
      width: 360
    }
  },
  hidden: {
    transform: 'translateX(-600px) !important'
  }
})

class DrawerLeft extends React.Component {
  renderMenu = (menuType) => {
    const { application, appid, expandedPanel, handleExpansionPanel, menu, onChangeFews, onChangeChoices, onItemClick, renderAccordion, snackbar, toggleSteps, url } = this.props
    const openModals = this.props.dialogs.state && this.props.dialogs.state.modals
    switch (menuType) {
      case 'accordion':
        return (
          <MenuAccordion
            onChangeChoices={(name, value, choices) => onChangeChoices(name, value, choices)}
            onChangeFews={(name, value) => onChangeFews(name, value)}
            renderAccordion={renderAccordion}
            handleExpansionPanel={handleExpansionPanel}
            expandedPanel={expandedPanel}
            toggleSteps={toggleSteps}
            onClick={onItemClick}
          />
        )
      case 'list': default:
        return (
          <MenuList
            appid={appid}
            application={application}
            menuList={application.config.startMenu[menu.index].mainMenu}
            menuLabel={this.props.menu.label}
            onClick={onItemClick}
            url={url}
            openModals={openModals}
          />
        )
    }
  }

  render() {
    const { application, classes, drawers, onClose } = this.props
    const tooltip = `${application.config.name} | ${application.config.customer} | ${packageJson.version}`
    let logo = `/static/images/${application.config.schema}/logo.png`
    if (process.env.type === 'app') {
      logo = `static/images/${application.config.schema}/logo.png`
    }
    return (
      <Drawer
        anchor='left'
        variant='persistent'
        classes={drawers.left ? { paper: `drawerLeft ${classes.drawerPaper}` } : { paper: `drawerLeft ${classes.drawerPaper} ${classes.hidden}` }}
        open={drawers.left}
      >
        <MenuHeader
          icon={<ChevronLeftIcon />}
          imageSrc={logo}
          onClick={onClose}
          titleText={application.config.name}
          tooltip={tooltip}
          type={'left'}
        />
        {this.renderMenu(application.config.menuType)}
      </Drawer>
    )
  }
}

DrawerLeft = withStyles(styles, { withTheme: true })(DrawerLeft)
export default connect(state => state)(DrawerLeft)
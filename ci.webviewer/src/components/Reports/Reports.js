import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import asyncActions from '../../state/async-actions'
import * as actions from '../../state/actions'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import ReportsTable from '../ReportsTable'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  pageContainer: {
    background: theme.palette.background.default,
    position: 'relative',
    height: 'inherit'
  },
  container: {
    margin: 'auto',
    maxWidth: 960,
    height: 'inherit'
  },
  header: {
    display: 'flex',
    height: 'unset',
    [theme.breakpoints.up('xs')]: {
      paddingLeft: theme.spacing(7)
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(8),
      height: 64
    },
    [theme.breakpoints.up(1080)]: {
      paddingLeft: 0
    }
  },
  tabs: {
    width: '100%'
  },
  tab: {
    maxWidth: 'unset',
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    marginRight: '-1px',
    [theme.breakpoints.up('xs')]: {
      minHeight: theme.spacing(7)
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: theme.spacing(8)
    }
  },
  title: {
    lineHeight: 3.2,
    fontWeight: 400,
    flexShrink: 0,
    margin: `0 ${theme.spacing(3)}px 0 ${theme.spacing(1)}px`,
    [theme.breakpoints.up('xs')]: {
      display: 'none'
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  formControl: {
    margin: `0 ${theme.spacing(1)}px`,
    marginLeft: theme.spacing(2)
  },
  popper: {
    zIndex: 1
  }
})

class Reports extends React.Component {

  constructor(props) {
    super(props)
    this.anchorEl = []
    const { logtype, from, to } = this.props.database

    this.state = {
      tabindex: 0,
      open: false,
      menu: logtype
    }

    this.props.dispatch(asyncActions.getLog(process.env.webserver, this.props.appid, logtype, from, to))
  }

  onClickTab = (event, value) => {
    this.setState({
      tabindex: value,
      open: true
    })
  }

  handleClose = (event) => {
    this.setState({ open: false })
  }

  handleMenuItemClick = (event, item) => {
    const { appid } = this.props
    const { from, to } = this.props.database

    this.setState({
      open: false,
      menu: Number(item.id)
    })
    this.props.dispatch({ type: actions.SET_REPORT_LOGTYPE, logtype: Number(item.lookupid) })
    this.props.dispatch(asyncActions.getLog(process.env.webserver, appid, Number(item.lookupid), from, to))
  }

  renderSubMenu = () => {
    const { classes } = this.props
    const { tabindex, open, menu } = this.state
    const { rapportmenu } = this.props.database.appinfo
    const menuitems = rapportmenu[tabindex].items

    if (!this.anchorEl[tabindex]) return null
    return (
      <Popper className={classes.popper} open={open} anchorEl={this.anchorEl[tabindex]} placement='bottom'>
        <Paper square>
          <ClickAwayListener onClickAway={this.handleClose}>
            <MenuList>
              {menuitems.map(menuitem =>
                <MenuItem
                  key={menuitem.id}
                  selected={Number(menuitem.id) === menu}
                  onClick={event => this.handleMenuItemClick(event, menuitem)}
                >
                  {menuitem.label}
                </MenuItem>
              )}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    )
  }

  renderTabs = () => {
    const { classes } = this.props
    const { rapportmenu } = this.props.database.appinfo
    if (!rapportmenu) return null
    return (
      <React.Fragment>
        <Tabs
          className={classes.tabs}
          indicatorColor="primary"
          onChange={this.onClickTab}
          scrollButtons='off'
          textColor="primary"
          value={this.state.tabindex}
          variant='scrollable'
        >
          {rapportmenu.map((item, index) => (
            <Tab
              aria-owns={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              buttonRef={node => {
                this.anchorEl[index] = node
              }}
              className={classes.tab}
              key={item.id}
              label={item.label}
            >
            </Tab>
          ))}
        </Tabs>
        {this.renderSubMenu()}
      </React.Fragment>
    )
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.pageContainer}>
        <Paper square className={classes.container}>
          <div className={classes.header}>
            <Typography variant="h6" className={classes.title}>Status overgangen</Typography>
            {this.renderTabs()}
          </div>
          <ReportsTable content={this.state.name} />
        </Paper>
      </div>
    )
  }
}

Reports = withStyles(styles, { withTheme: true })(Reports)
export default connect(state => state)(Reports)
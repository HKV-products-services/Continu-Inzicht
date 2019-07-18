import React from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import asyncActions from '../../../state/async-actions'
import * as actions from '../../../state/actions'

import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DrawerLeft from '../../DrawerLeft'
import Fab from '@material-ui/core/Fab'
import Reports from '../../Reports'
import LinearProgress from '@material-ui/core/LinearProgress'

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
    position: 'absolute',
    zIndex: 999,
    right: 0,
    [theme.breakpoints.up('xs')]: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      border: 'none'
    },
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      border: '1px solid #ccc'
    },
    '&:first-of-type': {
      right: 'unset'
    },
    '&:nth-of-type(3)': {
      right: 'unset',
      bottom: 20,
      transition: '225ms cubic-bezier(0, 0, 0.2, 1) 0ms'
    }
  },
  progress: {
    position: 'absolute',
    zIndex: 999,
    width: '100%'
  }
})

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.props.dispatch({ type: actions.LOADING_STATE, loading: true })
    this.props.dispatch({ type: actions.SET_MENU_INDEX, index: 2 })
    this.props.dispatch(asyncActions.setApplicationConfig(this.props.url)).then((application) => {
      if (process.env.type === 'app') {
        application.config = JSON.parse(application.statusText).application[0]
      }
      application.config.openDrawers.map(drawer => {
        const type = `DRAWER_${drawer.toUpperCase()}_STATE`
        this.props.dispatch({ type: actions[type], open: window.innerWidth <= 600 ? false : true })
      })
      this.props.dispatch(asyncActions.getAppInfo(process.env.webserver, 'ci', application.config.id))
      this.props.dispatch({ type: actions.LOADING_STATE, loading: false })
    })
  }

  openDrawerLeft = () => {
    this.props.dispatch({ type: actions.DRAWER_LEFT_STATE, open: true })
  }

  closeDrawerLeft = () => {
    this.props.dispatch({ type: actions.DRAWER_LEFT_STATE, open: false })
  }

  render() {
    const { application, classes, database, url, appid } = this.props
    if (!database.appinfo.name) return null
    let icon = `/static/images/${application.config.schema}/favicon.ico`
    if (process.env.type === 'app') {
      icon = `../static/images/${application.config.schema}/favicon.ico`
    }
    return (
      <React.Fragment>
        <Head>
          <title>{application.config.name}</title>
          {icon && <link rel="shortcut icon" type="image/x-icon" href={icon} />}
        </Head>
        {database.loading && <LinearProgress className={classes.progress} />}
        <Fab
          className={classes.button}
          color="primary"
          aria-label="Menu"
          onClick={this.openDrawerLeft}
        >
          <ChevronRightIcon />
        </Fab>
        <DrawerLeft
          onClose={this.closeDrawerLeft}
          url={window.location.pathname}
          appid={appid}
        />
        <Reports appid={appid} />
      </React.Fragment>
    )
  }
}

Page = withStyles(styles, { withTheme: true })(Page)
export default connect(state => state)(Page)
import React from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import asyncActions from '../../../state/async-actions'
import * as actions from '../../../state/actions'
const { DRAWER_LEFT_STATE, LOADING_STATE } = actions

import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DrawerLeft from '../../DrawerLeft'
import Fab from '@material-ui/core/Fab'
import LinearProgress from '@material-ui/core/LinearProgress'
import Toelichting from '../../Toelichting'

const styles = theme => ({
  pageContainer: {
    background: theme.palette.background.default,
    position: 'relative',
    minHeight: '100%'
  },
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
  }
})

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.props.dispatch({ type: LOADING_STATE, loading: true })
    this.props.dispatch(asyncActions.setApplicationConfig(this.props.url)).then((application) => {
      application.config.openDrawers.map(drawer => {
        const type = `DRAWER_${drawer.toUpperCase()}_STATE`
        this.props.dispatch({ type: actions[type], open: window.innerWidth <= 600 ? false : true })
      })
      this.props.dispatch(asyncActions.getAppInfo(process.env.webserver, 'ci', application.config.id))
      this.props.dispatch({ type: LOADING_STATE, loading: false })
    })
  }

  openDialog = () => {
    return null
  }
  
  openDrawerLeft = () => {
    this.props.dispatch({
      type: DRAWER_LEFT_STATE,
      open: true
    })
  }
  
  closeDrawerLeft = () => {
    this.props.dispatch({
      type: DRAWER_LEFT_STATE,
      open: false
    })
  }

  render() {
    const { application, classes, database, url, appid } = this.props
    if (!database.appinfo.name) return null
    return (
      <div className={classes.pageContainer}>
        <Head><title>{application.config.name}</title></Head>
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
          onItemClick={this.openDialog}
          url={window.location.pathname}
          appid={appid}
        />
        <Toelichting appid={appid} />
      </div>
    )
  }
}

Page = withStyles(styles, { withTheme: true })(Page)
export default connect(state => state)(Page)
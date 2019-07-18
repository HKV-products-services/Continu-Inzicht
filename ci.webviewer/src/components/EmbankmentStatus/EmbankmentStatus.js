import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  embankmentStatus: {
    position: 'absolute',
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'content-box',
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    zIndex: 999,
    [theme.breakpoints.up('xs')]: {
      maxWidth: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 400
    }
  },
  title: {
    textAlign: 'center',
    fontWeight: 500,
    width: '100%',
  },
  container: {
    padding: 0,
    margin: `0 ${theme.spacing(0.5)}px 0`,
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    '&:first-of-type': {
      margin: `0 ${theme.spacing(0.5)}px 0 0`
    },
    '&:last-of-type': {
      margin: `0 0 0 ${theme.spacing(0.5)}px`
    }
  },
  button: {
    padding: theme.spacing(0.5)
  }
})

class EmbankmentStatus extends React.Component {
  render() {
    const { classes, database, moment } = this.props
    if (!database.appinfo.moments || !database.appinfo.moments.length > 0) return null
    const { stateinfo } = database.appinfo.moments[moment.index]
    return (
      <Paper square className={classes.embankmentStatus}>
        <Typography variant={'body1'} className={classes.title}>Status waterkeringen</Typography>
        {stateinfo.map((stateinfo, index) => (
          <div key={index} className={classes.container}>
            <Typography variant='subtitle2' align='center'>
              {stateinfo.description}
            </Typography>
            <Button
              size={'small'}
              className={classes.button}
              style={{ 'background': stateinfo.color }}
            >
              {`${stateinfo.length.toFixed(1)} ${stateinfo.unit}`}
            </Button>
          </div>
        ))}
      </Paper>
    )
  }
}

EmbankmentStatus = withStyles(styles, { withTheme: true })(EmbankmentStatus)
export default connect(state => state)(EmbankmentStatus)
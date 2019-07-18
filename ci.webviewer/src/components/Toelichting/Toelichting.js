import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  container: {
    margin: 'auto',
    maxWidth: 960,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1)
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2)
    }
  },
  header: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center'
    },
    [theme.breakpoints.up('md')]: {
      textAlign: 'left'
    }
  }
})

class Toelichting extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <Paper square className={classes.container}>
        <Typography gutterBottom variant='h4' className={classes.header}>Toelichting</Typography>
      </Paper>
    )
  }
}

export default withStyles(styles, { withThheme: true})(Toelichting)
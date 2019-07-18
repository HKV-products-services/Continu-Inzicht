import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { mToKm } from '../../lib/utils'

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
      maxWidth: 420
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
    width: '-webkit-fill-available',
    '&:first-of-type': {
      margin: `0 ${theme.spacing(0.5)}px 0 0`
    },
    '&:last-of-type': {
      margin: `0 0 0 ${theme.spacing(0.5)}px`
    }
  },
  button: {
    padding: theme.spacing(0.5),
    textTransform: 'lowercase'
  },
  scaleText: {
    [theme.breakpoints.up('xs')]: {
      fontSize: theme.typography.pxToRem(11)
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(14)
    }
  }
})

class EmbankmentStatusHhnk extends React.Component {

  calculateGebuState = (states, momentId) => {
    let gebuOV = []
    let gebuOVN = []
    console.log('states buiten', states.filter(state => state.name === 'D14A-DP 22'))
    {states.map(state => {
      // if (5.5 - state[`gebu_${state.gebu_status}_${momentId}`] >= 4.5) {
      //   gebuOV.push(state.length)
      // } else if (5.5 - state[`gebu_${state.gebu_status}_${momentId}`] < 4.5) {
      //   gebuOVN.push(state.length)
      // }
      console.log('')
      if (state[`gebu_${state.gebu_status}_${momentId}`] > 2) {
        gebuOV.push(state.length)
      } else if (state[`gebu_${state.gebu_status}_${momentId}`] <= 2) {
        gebuOVN.push(state.length)
      }
    })}
  }

  calculateGekbState = (states, momentId) => {
    let gekbOV = []
    let gekbOVN = []
    {states.map(state => {
      if (state[`gekb${state.gebu_status}_${momentId}`] > 2) {
        gekbOV.push(state.length)
      } else if (state[`gekb${state.gebu_status}_${momentId}`] <= 2) {
        gekbOVN.push(state.length)
      }
    })}
  }


  render() {
    const { classes, database, getMoment, moment, state, theme, type } = this.props
    if (!database.appinfo.moments || !database.appinfo.moments.length > 0 || !state.array) return null
    const momentId = getMoment(moment.index).index

    const gebuOpen = state.array.filter(item => item[`gebu_status_${momentId}`] === 'open voldoet')
    const gebuGesloten = state.array.filter(item => item[`gebu_status_${momentId}`] === 'gesloten voldoet')
    const gebuBeide = state.array.filter(item => item[`gebu_status_${momentId}`] === 'beide voldoen niet')

    const gekbOpen = state.array.filter(item => item[`gekb_status_${momentId}`] === 'open voldoet')
    const gekbGesloten = state.array.filter(item => item[`gekb_status_${momentId}`] === 'gesloten voldoet')
    const gekbBeide = state.array.filter(item => item[`gekb_status_${momentId}`] === 'beide voldoen niet')
    let gebuOpenLength = []
    let gebuGeslotenLength = []
    let gebuBeideLength = []
    let gekbOpenLength = []
    let gekbGeslotenLength = []
    let gekbBeideLength = []

    gebuOpen.map(item => { gebuOpenLength.push(item.length) })
    const GebuO = gebuOpenLength.reduce(function(a, b) { return a + b / 2 }, 0)

    gebuGesloten.map(item => { gebuGeslotenLength.push(item.length) })
    const GebuG = gebuGeslotenLength.reduce(function(a, b) { return a + b / 2 }, 0)

    gebuBeide.map(item => { gebuBeideLength.push(item.length) })
    const GebuB = gebuBeideLength.reduce(function(a, b) { return a + b / 2 }, 0)

    gekbOpen.map(item => { gekbOpenLength.push(item.length) })
    const GekbO = gekbOpenLength.reduce(function(a, b) { return a + b / 2 }, 0)

    gekbGesloten.map(item => { gekbGeslotenLength.push(item.length) })
    const GekbG = gekbGeslotenLength.reduce(function(a, b) { return a + b / 2 }, 0)

    gekbBeide.map(item => { gekbBeideLength.push(item.length) })
    const GekbB = gekbBeideLength.reduce(function(a, b) { return a + b / 2 }, 0)
    
    this.calculateGebuState(state.array, momentId)
    this.calculateGekbState(state.array, momentId)
    if (type === 'Eisen beheer') {
      return (
        <Paper square className={classes.embankmentStatus}>
          <Typography variant={'body1'} className={classes.title}>Type beheer dat voldoet</Typography>
          <div style={{display: 'flex', flexGrow: 1}}>
            <Typography style={{alignSelf: 'flex-end', marginBottom: theme.spacing(0.5), marginRight: theme.spacing(1)}}>GEBU</Typography>
            <div className={classes.container}>
              <Typography variant='subtitle2' align='center' className={classes.scaleText}>Open zode</Typography>
              <Button size={'small'} className={classes.button} style={{ 'background': '#43e8d8' }}>{mToKm(GebuO)}km</Button>
            </div>
            <div className={classes.container}>
              <Typography variant='subtitle2' align='center' className={classes.scaleText}>Gesloten zode</Typography>
              <Button size={'small'} className={classes.button} style={{ 'background': '#00aedb' }}>{mToKm(GebuG)}km</Button>
            </div>
            <div className={classes.container}>
              <Typography variant='subtitle2' align='center' className={classes.scaleText}>Beide voldoen niet</Typography>
              <Button size={'small'} className={classes.button} style={{ 'background': '#be29ec' }}>{mToKm(GebuB)}km</Button>
            </div>
          </div>
          <div style={{display: 'flex', flexGrow: 1, marginTop: theme.spacing(1)}}>
            <Typography style={{alignSelf: 'flex-end', marginBottom: theme.spacing(0.5), marginRight: theme.spacing(1)}}>GEKB</Typography>
            <div className={classes.container}>
              <Button size={'small'} className={classes.button} style={{ 'background': '#43e8d8' }}>{mToKm(GekbO)}km</Button>
            </div>
            <div className={classes.container}>
              <Button size={'small'} className={classes.button} style={{ 'background': '#00aedb' }}>{mToKm(GekbG)}km</Button>
            </div>
            <div className={classes.container}>
              <Button size={'small'} className={classes.button} style={{ 'background': '#be29ec' }}>{mToKm(GekbB)}km</Button>
            </div>
          </div>
        </Paper>
      )
    } else if (type === 'Type beheer') {
      return (
        <Paper square className={classes.embankmentStatus}>
          <Typography variant={'body1'} className={classes.title}>Type beheer dat voldoet</Typography>
          <div style={{display: 'flex', flexGrow: 1, width: '100%'}}>
            <Typography style={{alignSelf: 'flex-end', marginBottom: theme.spacing(0.5), marginRight: theme.spacing(1)}}>GEBU</Typography>
            <div className={classes.container}>
              <Typography variant='subtitle2' align='center'>Voldoet</Typography>
              <Button size={'small'} className={classes.button} style={{ 'background': '#00cc00' }}>{mToKm(GebuO)}km</Button>
            </div>
            <div className={classes.container}>
              <Typography variant='subtitle2' align='center'>Voldoet niet</Typography>
              <Button size={'small'} className={classes.button} style={{ 'background': '#ff0000' }}>{mToKm(GebuB + GebuG)}km</Button>
            </div>
          </div>
          <div style={{display: 'flex', flexGrow: 1, marginTop: theme.spacing(1), width: '100%'}}>
            <Typography style={{alignSelf: 'flex-end', marginBottom: theme.spacing(0.5), marginRight: theme.spacing(1)}}>GEKB</Typography>
            <div className={classes.container}>
              <Button size={'small'} className={classes.button} style={{ 'background': '#00cc00' }}>{mToKm(GekbO)}km</Button>
            </div>
            <div className={classes.container}>
              <Button size={'small'} className={classes.button} style={{ 'background': '#ff0000' }}>{mToKm(GekbB + GekbG)}km</Button>
            </div>
          </div>
        </Paper>
      )
    }
  }
}

EmbankmentStatusHhnk = withStyles(styles, { withTheme: true })(EmbankmentStatusHhnk)
export default connect(state => state)(EmbankmentStatusHhnk)
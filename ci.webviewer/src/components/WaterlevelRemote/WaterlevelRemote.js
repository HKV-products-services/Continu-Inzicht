import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import LocationIcon from '@material-ui/icons/LocationOn'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import './index.css'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
    transition: '225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    '&:hover': {
      background: theme.palette.grey[50]
    },
    [theme.breakpoints.up('xs')]: {
      flexGrow: 1,
      padding: theme.spacing(0.5),
      marginLeft: theme.spacing(1),
      width: '30%',
      '&:nth-of-type(3n + 1)': {
        marginLeft: 0
      }
    },
    [theme.breakpoints.up('sm')]: {
      flexGrow: 0,
      padding: theme.spacing(1),
      marginLeft: 0,
      width: 'calc(400px / 3)'
    },
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  container: {
    position: 'absolute',
    top: 0,
    zIndex: 999,
    flexWrap: 'wrap',
    justifyContent: 'center',
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'row',
      margin: `calc(110px + ${theme.spacing(2)}px) ${theme.spacing(1)}px 0`,
      width: `calc(100% - ${theme.spacing(2)}px)`
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      margin: `calc(110px + ${theme.spacing(2)}px) ${theme.spacing(1)}px 0`,
      width: `calc(100% - ${theme.spacing(2)}px)`
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'column',
      margin: `${theme.spacing(1)}px 0 0 calc(46px + ${theme.spacing(2)}px)`,
      width: 'unset',
      paddingTop: '0 !important'
    }
  },
  openLeft: {
    [theme.breakpoints.up('xs')]: {
      marginLeft: theme.spacing(1),
      marginTop: `calc(110px + ${theme.spacing(2)}px)`
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 368,
      marginTop: 64
    }
  },
  label: {
    lineHeight: 1.2,
    flexGrow: 1,
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content'
  },
  button: {
    zIndex: 999,
    width: 46,
    height: 46,
    border: '1px solid #ccc'
  }
})

class WaterlevelRemote extends React.Component {
  setLayerStyle = (remoteLayers, index) => {
    const { moments } = this.props.database.appinfo
    const { uncertainty } = this.props
    if (remoteLayers.length > 0) {
      const code = uncertainty.code.toLowerCase()
      const moment = moments[index]
      const styleField = `${code}_${moment.name}`
      remoteLayers.forEach(function (layer) {
        const value = layer.properties[styleField];
        layer.style.color = value !== null ? value : "#BDBDBD"
        layer.style.fill = value !== null ? value : "#BDBDBD"
      })
    }
  }

  render() {
    const { application, classes, drawers, menu, moment, onClick, overlays, uncertainty, waterlevel } = this.props
    const layers = overlays.geoJson.layers.filter(layer => layer.view === 'waterstanden')
    if (!layers.length > 0) return null
    const layer = layers[0]
    const a = layer.data.features
    if (!a) return null
    const b = application.config.stationOptions.remoteLayers
    if (!b) return null
    const remoteLayers = a.filter(f => b.includes(f.properties.code))
    remoteLayers.forEach(remoteLayer => {
      remoteLayer.style = layer.style
    })
    return (
      <div style={{
        display: waterlevel.remote ? 'inline-flex' : 'none',
        paddingTop: uncertainty.alert || menu.index === 1 ? 38 : 0
      }} className={`${drawers.left ? classes.openLeft : null} ${classes.container}`}>
        {remoteLayers.map((layer, index) => {
          const event = {
            target: {
              feature: {
                id: layer.id,
                properties: {
                  name: layer.properties.name
                }
              },
              options: {
                pane: layer.geometry.type
              }
            }
          }
          return (
            <Paper square key={index} align="center" className={classes.root} onClick={() => onClick(event)}>
              <LocationIcon className={'remoteIcon'} fontSize="large" style={{color: layer.style.color}} />
              <Typography className={classes.label}>{layer.properties.name}</Typography>
            </Paper>
          )
        })}
        {this.setLayerStyle(remoteLayers, moment.index)}
      </div>
    )
  }
}

WaterlevelRemote = withStyles(styles, { withTheme: true })(WaterlevelRemote)
export default connect(state => state)(WaterlevelRemote)
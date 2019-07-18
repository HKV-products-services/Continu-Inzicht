import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import CheckIcon from '@material-ui/icons/CheckCircle'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import WarningIcon from '@material-ui/icons/WarningRounded'
import Select from '@material-ui/core/Select'
import StopIcon from '@material-ui/icons/RemoveCircle'
import Typography from '@material-ui/core/Typography'

import './index.css'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    width: '100%',
    background: theme.palette.grey[50],
    padding: theme.spacing(1)
  },
  contentLarge: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'column',
      flexGrow: 1,
      justifyContent: 'center'
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row'
    },
    '&:nth-of-type(1)': {
      marginTop: 0
    }
  },
  contentSmall: {
    marginTop: theme.spacing(2),
    justifyContent: 'left'
  },
  svg: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('xs')]: {
      '&:last-of-type': {
      flexGrow: 0
      }
    },
    [theme.breakpoints.up('sm')]: {
      '&:last-of-type': {
      flexGrow: 1
      }
    }
  },
  text: {
    alignSelf: 'center',
    textAlign: 'left',
    [theme.breakpoints.up('xs')]: {
      marginLeft: theme.spacing(1),
      fontSize: theme.typography.pxToRem(20)
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
      fontSize: theme.typography.pxToRem(24)
    }
  },
  iconSmall: {
    fontSize: theme.typography.pxToRem(48),
    alignSelf: 'center'
  },
  formControl: {
    display: 'block'
  }
})

class SectionStatusHhnk extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gebu: null,
      gekb: null
    }
  }

  handleChange = (event) => {
    const { onApply, refreshMap } = this.props
    const { features, getMoment, moment, state } = this.props
    const momentId = getMoment(moment.index).index
    let type = {}
    let status = event.target.value === 0 ? 'open' : 'gesloten'
    let int = event.target.name === 'gebu' ? 0 : 1
    if (state.array.filter(item => item.name === features.properties.name)[int][`${event.target.name}_${status}_${momentId}`] <= 2) {
      type = 'open voldoet'
    } else {
      type = 'beide voldoen niet'
    }
    state.array.filter(item => item.name === features.properties.name)[int][`${event.target.name}_status`] = status
    // state.array.filter(item => item.name === features.properties.name)[int][`${event.target.name}_status_${momentId}`] = type
    state.markers.filter(marker => marker.vak === features.properties.name).find(e => e.failuremechanismid === int).status = event.target.value
    onApply(state, features)
    this.updateFeatures(features, status, event.target.name)
    refreshMap()
  }

  updateFeatures = (features, status, name) =>  {
    const { getFeatureColor } = this.props
    if (name === 'gebu') {
      this.setState({gebu: getFeatureColor(0, status, features.properties)})
    } else if (name === 'gekb') {
      this.setState({gekb: getFeatureColor(1, status, features.properties)})
    }
  }

  render() {
    const { classes, features, getFeatureColor, getFeatureStatus, grouplayers, type } = this.props
    const options = ['Open zode', 'Gesloten zode']
    const gebu = getFeatureStatus(0, features.properties)
    const gekb = getFeatureStatus(1, features.properties)
    if (type === 'Eisen beheer') {
      return (
        <div className={ classes.container }>
          <div className={`${classes.content} ${classes.contentLarge}`}>
            <div className={ classes.svg }>
              <WarningIcon className={'kadevak-status-icon'} style={{color: gebu.color}}/>
            </div>
            <div className={ classes.svg }>
              <Typography variant="h5" color="primary">{ `GEBU: ${gebu.status}` }</Typography>
            </div>
          </div>
          <div className={`${classes.content} ${classes.contentLarge}`}>
            <div className={ classes.svg }>
              <WarningIcon className={'kadevak-status-icon'} style={{color: gekb.color}}/>
            </div>
            <div className={ classes.svg }>
              <Typography variant="h5" color="primary">{ `GEKB: ${gekb.status}` }</Typography>
            </div>
          </div>
        </div>
      )
    } else if (type === 'Type beheer') {
      const gebuType = getFeatureColor(0, features.properties[`gebu_status`], features.properties)
      const gekbType = getFeatureColor(1, features.properties[`gekb_status`], features.properties)
      const gebuValue = features.properties[`gebu_status`] === 'open' ? 0 : 1
      const gekbValue = features.properties[`gekb_status`] === 'open' ? 0 : 1
      const beheer = grouplayers.items.find(item => item.key === 'beheer')
      return (
        <div className={ classes.container }>
          <div className={`${classes.content} ${classes.contentLarge}`}>
            <div className={ classes.svg }>
              { gebuType.color != '#ff0000'
                ? <CheckIcon className={'kadevak-status-icon'} style={{color: gebuType.color}}/>
                : <StopIcon className={'kadevak-status-icon'} style={{color: gebuType.color}}/>
              }
            </div>
            <div className={ classes.svg }>
              <Typography variant="h5" color="primary">{ `GEBU: ${gebuType.status != 'open voldoet' ? 'Voldoet niet' : 'Voldoet'}` }</Typography>
              { beheer.active ? <FormControl className={classes.formControl}>
                <Select
                  className={ classes.select }
                  value={ gebuValue }
                  name='gebu'
                  onChange={(e) => this.handleChange(e)}
                >
                  {options.map((option, index) => (
                    <MenuItem key={ index } value={ index }>{ option }</MenuItem>
                  ))}
                </Select>
              </FormControl>
              : null }
            </div>
          </div>
          <div className={`${classes.content} ${classes.contentLarge}`}>
            <div className={ classes.svg }>
              { gekbType.color != '#ff0000'
                ? <CheckIcon className={'kadevak-status-icon'} style={{color: gekbType.color}}/>
                : <StopIcon className={'kadevak-status-icon'} style={{color: gekbType.color}}/>
              }
            </div>
            <div className={ classes.svg }>
              <Typography variant="h5" color="primary">{ `GEKB: ${gekbType.status != 'open voldoet' ? 'Voldoet niet' : 'Voldoet'}` }</Typography>
              { beheer.active && <FormControl className={classes.formControl}>
                <Select
                  className={ classes.select }
                  value={ gekbValue }
                  name='gekb'
                  onChange={(e) => this.handleChange(e)}
                >
                  {options.map((option, index) => (
                    <MenuItem key={ index } value={ index }>{ option }</MenuItem>
                  ))}
                </Select>
              </FormControl> }
            </div>
          </div>
        </div>
      )
    }
  }
}

SectionStatusHhnk = withStyles(styles, { withTheme: true })(SectionStatusHhnk)
export default connect(state => state)(SectionStatusHhnk)
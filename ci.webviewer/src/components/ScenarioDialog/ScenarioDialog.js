import React from 'react'
import dynamic from 'next/dynamic'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import asyncActions from '../../state/async-actions'
import * as actions from '../../state/actions'
const { SET_SCENARIO_FROM, SET_SCENARIO_TO, SET_WATERLEVELS } = actions

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import ReplayIcon from '@material-ui/icons/Replay'
import ResizeObserver from 'react-resize-observer'
import Select from '@material-ui/core/Select'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import 'moment/locale/nl'

import { cmToM } from '../../lib/utils'

import { getVegaData, updateVegaData } from '../../state/async-actions/vega'

const HKVMap = dynamic(import('../HKVMap'), {ssr: false})
const HKVVega = dynamic(import("../HKVVega"), {ssr: false})

const styles = theme => ({
  container: {
    maxWidth: '100%',
    maxHeight: '100%',
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      margin: 0
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(8)
    }
  },
  dialogTitle: {
    [theme.breakpoints.up('xs')]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3)
    }
  },
  title: {
    [theme.breakpoints.up('xs')]: {
      fontSize: theme.typography.pxToRem(16)
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(20)
    }
  },
  contentOuter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: `0 ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  contentInner: {
    display: 'flex',
    justifyContent: 'start',
    flexGrow: 1,
    height: 'calc(100% - 68px)',
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
    }
  },
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'start',
    display: 'flex',
    overflowX: 'hidden',
    overflowY: 'auto',
    [theme.breakpoints.up('xs')]: {
      '&:first-of-type': {
        width: '100%',
        minHeight: 200
      },
      '&:last-of-type': {
        justifyContent: 'space-between',
        width: '100%',
        margin: '0',
        marginTop: theme.spacing(1)
      }
    },
    [theme.breakpoints.up('md')]: {
      '&:first-of-type': {
        width: 'calc(100% / 3)',
        minHeight: 'unset'
      },
      '&:last-of-type': {
        justifyContent: 'space-between',
        width: 'calc(100% / 3 * 2)',
        margin: `0 0 0 ${theme.spacing(2)}px`
      }
    }
  },
  selectionWrapper: {
    display: 'flex'
  },
  selections: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  formControl: {
    flexDirection: 'row'
  },
  units: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  unit: {
    margin: `0 0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    textAlign: 'right'
  },
  inline: {
    display: 'inline-block',
    marginBottom: theme.spacing(1)
  },
  inlineFlex: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    flexShrink: 0
  },
  datePicker: {
    display: 'flex',
    justifyContent: 'space-between',
    '&:first-of-type': {
      marginRight: theme.spacing(1)
    }
  },
  select: {
    textAlign: 'left',
    minWidth: 60
  },
  dialogActions: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    margin: 0
  },
  button: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px 0 0`,
    '&:last-of-type': {
      margin: `${theme.spacing(1)}px 0 0 0`
    }
  },
  content: {
    display: 'flex',
    height: 'calc(100% - 60px)',
    flexWrap: 'wrap'
  },
  reset: {
    alignSelf: 'center',
    marginBottom: '0.35em',
    cursor: 'pointer',
    transition: '225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    '&:hover': {
      color: theme.palette.primary.dark
    }
  },
  oneThird: {
    display: 'flex',
    width: 'calc(100% / 5 * 2)',
    height: 'calc(100% - 60px)'
  },
  twoThird: {
    display: 'flex',
    width: 'calc(100% / 5 * 3)',
    height: 'calc(100% - 60px)'
  }
})

class ScenarioDialog extends React.Component {
  constructor(props) {
    super(props)
    const to = new Date(Date.now())
    let from = new Date(Date.now())
    from.setHours(0, 0, 0, 0)

    this.state = {
      selections: [],
      from: from.getTime(),
      to: to.getTime(),
      startTime: null,
      endTime: null
    }
    let selections = {}
    const allowed = ['d', 'k', 'q', 'timedep', 'u', 'zp']
    this.props.dispatch(asyncActions.getScenarioOptions(process.env.webserver, this.props.appid))
      .then(data => {
        const filtered = Object.keys(data.options)
          .filter(key => allowed.includes(key))
          .reduce((obj, key) => {
            obj[key] = data.options[key]
            return obj
          }, {})
        {Object.keys(filtered).map(option => {
          if (filtered[option].values.length <= 1 || option === 'k') {
            selections[option] = filtered[option].values[0].id
          }
        })}
        this.setState({
          startTime: data.options.starttime,
          endTime: data.options.endtime,
          selections: selections
        })
      })
  }

  componentDidUpdate = (prevProps) => {
    const { appid, application, contourViewObject, dialogs, viewObject } = this.props
    const { endTime, selections, startTime } = this.state
    const { defaultStationId } = application.config.stationOptions
    // TODO
    if (dialogs.scenario === true) {
      if (appid === 6 || appid === 7|| appid === 1) {
        if (prevProps.contourViewObject !== contourViewObject) {
          const url = encodeURI(`https://${process.env.webserver}.hkvservices.nl/mangrove.github.ws/entry.asmx/Call?function=ci.appfunctions.GetWaterlevels&parameters={appid:${appid},stationid:${defaultStationId}`)
          let params = []
          for (var i in selections) {
            params.push(`${i}:${selections[i]}`)
          }
          const wmsurl = `${url},${params.join(',')}}`
          const status = selections.k === 1 ? 'open' : 'dicht'
          this.props.dispatch(getVegaData(viewObject, "source", wmsurl))
          this.props.dispatch(asyncActions.getWaterlevels(process.env.webserver, appid, defaultStationId, selections))
          this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'signal_date_interval', value: [startTime, endTime] }))
          if (contourViewObject) {
            if (selections.q && selections.zp) {
              this.props.dispatch(updateVegaData(contourViewObject, 'point_select', [{ 'Zeewaterstand': cmToM(selections.zp), 'Rijnafvoer': selections.q }]))
            }
            this.props.dispatch(asyncActions.sendSignal(contourViewObject, { signalName: 'STATUS', value: status }))
          }
        }
      } else {
        if (prevProps.viewObject !== viewObject) {
          const url = encodeURI(`https://${process.env.webserver}.hkvservices.nl/mangrove.github.ws/entry.asmx/Call?function=ci.appfunctions.GetWaterlevels&parameters={appid:${appid},stationid:${defaultStationId}`)
          let params = []
          for (var i in selections) {
            params.push(`${i}:${selections[i]}`)
          }
          const wmsurl = `${url},${params.join(',')}}`
          this.props.dispatch(getVegaData(viewObject, "source", wmsurl))
          this.props.dispatch(asyncActions.getWaterlevels(process.env.webserver, appid, defaultStationId, selections))
          this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'signal_date_interval', value: [startTime, endTime] }))
        }
      }
    }
  }

  setMap = (mapObject) => {
    const { moment } = this.props
    this.mapObject = mapObject
    this.setWaterlevelLayer(true)
    this.onMomentChange(moment.index)
  }
  

  setWaterlevelLayer = (active) => {
    const { application } = this.props
    const layers = application.config.map.overlays.filter(layer => layer.view === 'waterstanden')
    layers.forEach(layer => {
      layer.active = active
      layer.onClick = this.onClickStation
      layer.onMouseOver = null
      layer.onMouseOut = null
      this.props.dispatch(asyncActions.addOverlay(this.mapObject, layer))
    })
  }

  getMoment = (index) => {
    const { moments } = this.props.database.appinfo
    return moments[index]
  }

  onMomentChange = (index) => {
    const { application, uncertainty } = this.props
    const { location } = this.state
    const { defaultStationName, defaultStationId } = application.config.stationOptions
    const moment = this.getMoment(index)
    const code = uncertainty.code.toLowerCase()
    const styleField = `${code}_${moment.name}`
    const activeLocation = location == undefined ? defaultStationId : location
    let activeLayer = null
    this.mapObject.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        // Waterstanden
        if (layer.feature.id === activeLocation) {
          activeLayer = layer
        }
        const value = layer.feature.properties[styleField]
        const momentStyle = {
          "fillColor": value !== null ? value : "#BDBDBD",
          "color": value !== null ? value : "#BDBDBD",
          "border": '1px solid #000'
        }
        const activeStyle = {
          "fillColor": "#2196f3",
          "color": "#2196f3",
          "border": '1px solid #000'
        }
        layer.setIcon(layer.defaultOptions.iconFactory(momentStyle))
        activeLayer && activeLayer.setIcon(layer.defaultOptions.iconFactory(activeStyle))
      }
      else if ((layer instanceof L.Polyline) || (layer instanceof L.Polygon)) {
        // Waterkeringen en gebieden
        const value = layer.feature.properties[styleField]
        const momentStyle = {
          "fillColor": value !== null ? value : "#BDBDBD",
          "color": value !== null ? value : "#BDBDBD"
        }
        layer.setStyle(momentStyle)
      }
    })
  }

  onClickStation = (event) => {
    // CHECK
    const { appid, contourViewObject, menu, viewObject } = this.props
    const { selections } = this.state
    const stationId = event.target.feature.id
    const stationName = event.target.feature.properties.name
    //TODO
    let url = null
    let params = []
    let wmsurl = null
    switch(appid) {
      case 5:
        url = encodeURI(`https://${process.env.webserver}.hkvservices.nl/mangrove.github.ws/entry.asmx/Call?function=ci.appfunctions.GetWaterlevels&parameters={appid:${appid},stationid:${stationId}`)
        this.setState({location: event.target.feature.id})
        this.onMomentChange(menu.index)
        if (selections.q === undefined) return null

        this.props.dispatch(asyncActions.getWaterlevels(process.env.webserver, appid, stationId, selections))
        for (var i in selections) {
          params.push(`${i}:${selections[i]}`)
        }
        wmsurl = `${url},${params.join(',')}}`
        this.props.dispatch(getVegaData(viewObject, "source", wmsurl))
      case 6:
      case 7:
        url = encodeURI(`https://${process.env.webserver}.hkvservices.nl/mangrove.github.ws/entry.asmx/Call?function=ci.appfunctions.GetWaterlevels&parameters={appid:${appid},stationid:${stationId}`)
        this.setState({
          location: stationId,
          stationName: stationName
        }, () => {
          this.props.dispatch(asyncActions.sendSignal(contourViewObject, { signalName: 'LOCATIE', value: stationName }))
        })
        this.onMomentChange(menu.index)
        if (selections.q === undefined
          || selections.zp === undefined
          || selections.u === undefined
          || selections.d === undefined
          || selections.k === undefined
          || selections.timedep === undefined) return null
        this.props.dispatch(asyncActions.getWaterlevels(process.env.webserver, appid, stationId, selections))
        for (var i in selections) {
          params.push(`${i}:${selections[i]}`)
        }
        wmsurl = `${url},${params.join(',')}}`
        this.props.dispatch(getVegaData(viewObject, "source", wmsurl))
    }
  }

  resetChart = () => {
    // CHECK
    const { appid, contourViewObject, viewObject } = this.props
    const { selections } = this.state
    const stationId = 1
    const parameters = {
      appid: appid,
      stationid: stationId
    }
    const url = encodeURI(`https://${process.env.webserver}.hkvservices.nl/mangrove.github.ws/entry.asmx/Call?function=ci.appfunctions.GetWaterlevels&parameters={appid:${appid},stationid:${stationId}`)
    let params = []

    for (var i in selections) {
      params.push(`${i}:${1}`)
    }
    const wmsurl = `${url},${params.join(',')}}`
    this.props.dispatch(getVegaData(viewObject, "source", wmsurl))
    this.props.dispatch(updateVegaData(contourViewObject, 'point_select', null))
    this.props.dispatch(asyncActions.sendSignal(contourViewObject, { signalName: 'STATUS', value: 'dicht' }))
  }

  handleDateChange = name => date => {
    const { viewObject } = this.props
    const { activeStartTime, activeEndTime, startTime, endTime } = this.state
    const value = date.toDate()
    if (value) {
      if (name === 'from') {
        const from = new Date(value).getTime()
        this.setState({activeStartTime: from})
        this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'signal_date_interval', value: [from, activeEndTime == undefined ? endTime : activeEndTime] }))
      }
      else if (name === 'to') {
        const to = new Date(value).getTime()
        this.setState({activeEndTime: to})
        this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'signal_date_interval', value: [activeStartTime == undefined ? startTime : activeStartTime, to] }))
      }
    }
  }

  closeDialog = () => {
    const { application, onClose } = this.props
    const activeLayers = application.config.map.overlays.filter(overlay => overlay.active === true)
    if (activeLayers.length > 1) {
      this.setWaterlevelLayer(false)
    }
    onClose('Scenario')
  }

  handleApply = (fromDate, toDate) => {
    const { application } = this.props
    const { selections } = this.state
    const activeLayers = application.config.map.overlays.filter(overlay => overlay.active === true)
    if (activeLayers.length > 1) {
      this.setWaterlevelLayer(false)
    }
    this.props.dispatch({ type: SET_SCENARIO_FROM, from: fromDate })
    this.props.dispatch({ type: SET_SCENARIO_TO, to: toDate })
    this.props.onApply(selections, fromDate, toDate)
  }

  handleChange = (event) => {
    const { appid, application, contourViewObject, database, viewObject } = this.props
    const { activeStartTime, activeEndTime, location, selections } = this.state
    const { defaultStationName, defaultStationId } = application.config.stationOptions
    const start = activeStartTime == undefined ? database.scenarioOptions.starttime : activeStartTime
    const end = activeEndTime == undefined ? database.scenarioOptions.endtime : activeEndTime
    const activeLocation = location ? location : defaultStationId
    const allowed = ['d', 'k', 'q', 'timedep', 'u', 'zp']
    const name = event.target.name
    const url = encodeURI(`https://${process.env.webserver}.hkvservices.nl/mangrove.github.ws/entry.asmx/Call?function=ci.appfunctions.GetWaterlevels&parameters={appid:${appid},stationid:${activeLocation}`)
    selections[name] = event.target.value.toString()
    let status = selections.k === 1 ? 'open' : 'dicht'
    let params = []
    if (event.target.name == 'k') {
      if (event.target.value == 0) {
        status = 'dicht'
      } else {
        status = 'open'
      }
      this.props.dispatch(asyncActions.sendSignal(contourViewObject, { signalName: 'STATUS', value: status }))
    }
    this.props.dispatch(asyncActions.getScenarioOptions(process.env.webserver, appid, selections))
      .then(data => {
        const filtered = Object.keys(data.options)
          .filter(key => allowed.includes(key))
          .reduce((obj, key) => {
            obj[key] = data.options[key]
            return obj
          }, {})
        {Object.keys(filtered).map(option => {
          if (filtered[option].values.length <= 1 || option === 'k') {
            selections[option] = filtered[option].values[0].id
          }
        })}
        this.setState({
          selections: selections
        }, () => {
          for (var i in selections) {
            params.push(`${i}:${selections[i]}`)
          }
          const wmsurl = `${url},${params.join(',')}}`
          this.props.dispatch(getVegaData(viewObject, "source", wmsurl))
          this.props.dispatch(asyncActions.getWaterlevels(process.env.webserver, appid, activeLocation, selections))
          this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'signal_date_interval', value: [start, end] }))
          if (selections.q && selections.zp) {
            this.props.dispatch(updateVegaData(contourViewObject, 'point_select', [{ 'Zeewaterstand': cmToM(selections.zp), 'Rijnafvoer': selections.q }]))
          }
          this.props.dispatch(asyncActions.sendSignal(contourViewObject, { signalName: 'STATUS', value: status }))
        })
      })
  }

  handleReset = () => {
    const { appid } = this.props
    this.props.dispatch(asyncActions.getScenarioOptions(process.env.webserver, appid))
      .then(data => {
        this.setState({ selections: {} })
        // TODO
        if (appid !== 6 || appid !== 7) return null
        this.setState({
          selections: { k: data.options.k.values[0].id }
        })
      })
    // Reset waterlevels data
    this.resetChart()
    this.props.dispatch({
      type: SET_WATERLEVELS,
      waterlevels: null
    })
  }

  render() {
    const { appid, application, classes, database, dialogs, onExport, onResize, setContourView, setView } = this.props
    const { activeEndTime, activeStartTime, endTime, selections, startTime, stationName } = this.state
    const { defaultStationName, defaultStationId } = application.config.stationOptions
    const vegaSpec = application.config.vega.find(spec => spec.key === 'scenario')
    const vegaSpecContour = application.config.vega.filter(spec => spec.key === 'contourplot')[0]
    // const vegaSpecContour = application.config.vega.filter(spec => spec.key === 'contourplot').find(e => e.name === `Contourplot ${!stationName ? defaultStationName : stationName}`)

    moment.locale("nl")
    let filter = null
    
    // TODO
    if (selections) {
      if (appid === 5) {
        filter = selections.q === undefined ? true : false
      } 
      else if (appid === 6 || appid === 7|| appid === 1) {
        filter = selections.q === undefined
          || selections.zp === undefined
          || selections.u === undefined
          || selections.d === undefined
          || selections.k === undefined
          || selections.timedep === undefined
          ? true
          : false
      }
    }

    if (!vegaSpec) return null
    if (!database.scenarioOptions) return null
    const allowed = ['d', 'k', 'q', 'timedep', 'u', 'zp']
    const filtered = Object.keys(database.scenarioOptions)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = database.scenarioOptions[key]
        return obj
      }, {})

    return (
      <Dialog
        fullScreen={true}
        open={dialogs.scenario}
        className={classes.container}
        onBackdropClick={this.closeDialog}
        maxWidth={false}
      >
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <Typography className={classes.title} variant="h6">Selectie what-if scenario</Typography>
        </DialogTitle>
        <DialogContent className={classes.contentOuter}>
          <div className={classes.contentInner}>
            <div className={classes.wrapper}>
              <div className={classes.inlineFlex}>
                <Typography gutterBottom variant="h6" align="left">Selecteer een what-if scenario</Typography>
                <Tooltip title='Reset de keuzelijst'>
                  <ReplayIcon className={classes.reset} color="primary" onClick={this.handleReset} />
                </Tooltip>
              </div>
              <div className={classes.selectionWrapper}>
                <div className={classes.selections}>
                  {Object.keys(filtered).map((option, index) => (
                    <div key={index} className={classes.inlineFlex}>
                      <Typography style={{ alignSelf: 'flex-end' }} variant='body1'>{database.scenarioOptions[option].caption}</Typography>
                      <FormControl className={classes.formControl}>
                        <Select
                          classes={{select: classes.select}}
                          value={selections[option] == undefined ? ' ' : selections[option]}
                          name={option}
                          onChange={this.handleChange}
                        >
                          {database.scenarioOptions[option].values.map((option, index) => (
                            <MenuItem key={index} value={option.id}>{option.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  ))}
                </div>
                <div className={classes.units}>
                  {Object.keys(filtered).map((option, index) => (
                    <Typography key={index} className={classes.unit}>{database.scenarioOptions[option].unit}</Typography>
                  ))}
                </div>
              </div>
              <Typography gutterBottom variant="h6" align="left">Kies een begin en eindtijd van het what-if scenario</Typography>
              <div className={classes.inlineFlex} style={{justifyContent: 'left'}}>
                <MuiPickersUtilsProvider utils={MomentUtils} locale={'nl'} moment={moment}>
                  <DateTimePicker
                    ampm={false}
                    className={classes.datePicker}
                    disabled={!startTime ? true : false}
                    format="LLL"
                    label="Van"
                    onChange={this.handleDateChange('from')}
                    minDate={startTime}
                    maxDate={activeEndTime ? activeEndTime : endTime}
                    value={activeStartTime ? activeStartTime : startTime}
                  />
                  <DateTimePicker
                    ampm={false}
                    className={classes.datePicker}
                    disabled={!startTime ? true : false}
                    format="LLL"
                    label="Tot"
                    onChange={this.handleDateChange('to')}
                    minDate={activeStartTime ? activeStartTime : startTime}
                    maxDate={endTime}
                    value={activeEndTime ? activeEndTime : endTime}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <DialogActions classes={{ root: classes.dialogActions }}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={this.closeDialog}
                >
                  Annuleren
                </Button>
                <Button
                  disabled={filter}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={() => this.handleApply(activeStartTime ? activeStartTime : startTime, activeEndTime ? activeEndTime :endTime)}
                >
                  Toepassen
                </Button>
                <Button
                  disabled
                  // disabled={database.waterlevels && !database.waterlevels.exception ? false : true}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={() => onExport('waterlevels')}
                >
                  Exporteren
                </Button>
              </DialogActions>
            </div>
            <div className={classes.wrapper}>
              <div className={classes.content}>
                <HKVMap
                  setMap={this.setMap}
                  application={{ ...application }}
                />
              </div>
              {/* TODO */}
              { appid === 6 || appid === 7 || appid === 20 || appid === 1?
                <div className={classes.content}>
                  <Typography style={{width: '100%'}}>Locatie: {!stationName ? defaultStationName : stationName}</Typography>
                  <div className={classes.twoThird}>
                    <HKVVega
                      application={application}
                      setView={setView}
                      specs={vegaSpec.spec}
                    />
                    <ResizeObserver
                      onResize={(rect) => {
                        onResize(rect.width, rect.height, vegaSpec)
                      }}
                    />
                  </div>
                  <div className={classes.oneThird}>
                    <HKVVega
                      application={application}
                      setView={setContourView}
                      specs={vegaSpecContour.spec}
                    />
                    <ResizeObserver
                      onResize={(rect) => {
                        onResize(rect.width, rect.height, vegaSpecContour)
                      }}
                    />
                  </div>
                </div>
              : <div className={classes.content}>
                <Typography style={{width: '100%'}}>Locatie: {!stationName ? defaultStationName : stationName}</Typography>
                <HKVVega
                  application={application}
                  setView={setView}
                  specs={vegaSpec.spec}
                />
                <ResizeObserver
                  onResize={(rect) => {
                    onResize(rect.width, rect.height, vegaSpec)
                  }}
                />
              </div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

ScenarioDialog = withStyles(styles, { withTheme: true })(ScenarioDialog)
export default connect(state => state)(ScenarioDialog)
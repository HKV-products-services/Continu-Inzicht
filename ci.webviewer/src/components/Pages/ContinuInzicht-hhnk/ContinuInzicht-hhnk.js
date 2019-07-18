import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import asyncActions from '../../../state/async-actions'
import * as actions from '../../../state/actions'
const {
  DRAWER_LEFT_STATE,
  DRAWER_RIGHT_STATE,
  LOADING_STATE,
  SECTION_DIALOG_STATE,
  SET_ACTIVE_VIEW,
  SET_MENU_INDEX
} = actions

import Button from '@material-ui/core/Button'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import StartMenu from '../../StartMenu'
import DrawerLeft from '../../DrawerLeft'
import DrawerRight from '../../DrawerRight'
import EmbankmentStatusHhnk from '../../EmbankmentStatusHhnk'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Fab from '@material-ui/core/Fab'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import HkvDialog from '../../mangrove/HkvDialog'
import LinearProgress from '@material-ui/core/LinearProgress'
import MapLayout from '../../MapLayout'
import MomentStepper from '../../MomentStepper'
import ResizeObserver from 'react-resize-observer'
import SectionDialogHhnk from '../../SectionDialogHhnk'
import SectionStatusHhnk from '../../SectionStatusHhnk'
import SwipeableViews from 'react-swipeable-views'
import Typography from '@material-ui/core/Typography'

import { updateVegaData } from '../../../state/async-actions/vega'

const HKVVega = dynamic(import('../../HKVVega'), {
  ssr: false
})

const HKVMap = dynamic(import('../../HKVMap'), {
  ssr: false
})

const styles = theme => ({
  progress: {
    position: 'absolute',
    zIndex: 999,
    width: '100%'
  },
  button: {
    margin: theme.spacing(1),
    position: 'absolute',
    zIndex: 999,
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
    '&:last-of-type': {
      right: 0
    }
  },
  locations: {
    [theme.breakpoints.up('xs')]: {
      marginTop: `calc(${theme.spacing(5)}px + ${theme.spacing(2)}px)`,
      bottom: 120
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: `calc(${theme.spacing(6)}px + ${theme.spacing(2)}px)`,
      bottom: 'unset'
    }
  },
  expansionPanel: {
    '&:first-child': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
    },
    '&:last-child': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  },
  ExpansionPanelDetails: {
    display: 'flex',
    flexDirection: 'column',
    margin: `0 ${theme.spacing(1)}px`,
    padding: `0 ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    overflow: 'auto'
  },
  formControl: {
    margin: theme.spacing(1),
    width: `calc(100% - ${theme.spacing(2)}px)`
  }
})

class ContinuInzichtHhnk extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
      activeView: 'Eisen beheer',
      graph: { width: null, height: null, paddingTB: null, paddingTB: null },
      leafletControls: 0,
      viewObject: null
    }
    this.props.dispatch({ type: LOADING_STATE, loading: true })
    this.props.dispatch(asyncActions.setApplicationConfig(this.props.url)).then((application) => {
      if (process.env.type === 'app') {
        application.config = JSON.parse(application.statusText).application[0]
      }
      application.config.openDrawers.map(drawer => {
        const type = `DRAWER_${drawer.toUpperCase()}_STATE`
        this.props.dispatch({ type: actions[type], open: window.innerWidth <= 600 ? false : true })
      })
      this.props.dispatch(asyncActions.getAppInfo(process.env.webserver, 'ci', application.config.id))
      this.props.dispatch({ type: SET_ACTIVE_VIEW, active: 'hhnk' })
      this.props.dispatch({ type: LOADING_STATE, loading: false })
      if (application.config.startMenuActive === true) {
        this.props.dispatch({ type: SET_MENU_INDEX, index: 3 })
      }
    })
  }
  
  componentDidMount = () => {
    document.addEventListener("deviceready", this.onDeviceReady.bind(this), true)
  }

  onDeviceReady() {
    navigator.splashscreen.hide()
  }
  
  // Dialog bottom functions
  handleClick = (functionName, index) => {
    const functPtr = this[functionName]
    functPtr(index && index)
  }

  closeDialog = (key) => {
    let type = 'HKV_DIALOG_STATE'
    if (key) {
      type = `${key.toUpperCase()}_DIALOG_STATE`
    }
    if (key === 'drawer_scenario') {
      this.props.dispatch({ type: `${key.toUpperCase()}_STATE`, open: false })
      // drawer scenario is niet echt een dialog dus een reset van bijv de open modals is niet nodig
      return null
    } else {
      this.props.dispatch({ type: actions.DRAWER_LEFT_STATE, open: false })
      this.props.dispatch({ type: actions.HKV_DIALOG_STATE, open: false })
      this.props.dispatch({ type: type, open: false })
    }
    // resetten van vegaSpec & hkv dialog type
    this.props.dispatch({ type: actions.SET_VEGA_SPECIFICATION, specification: null })
    this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, value: null })
  }

  getMoment = (index) => {
    const { moments } = this.props.database.appinfo
    return moments[index]
  }

  onClickSection = (feature) => {
    const featureId = feature.id
    this.props.dispatch({type: SECTION_DIALOG_STATE, open: true})
    this.props.dispatch({type: actions.SET_FEATURE_ID, id: featureId})
    this.setState({ features: feature })
  }

  getFeatureStatus = (failureMechanismId, properties, index, activeView) => {
    const { moment } = this.props
    let momentId = null
    if (!index) {
      momentId = this.getMoment(moment.index).index
    } else {
      momentId = index
    }
    let color = '#be29ec'
    let status = null
    let activeOverlay = null
    if (!activeView) {
      activeOverlay = this.state.activeView
    } else {
      activeOverlay = activeView
    }
    if (activeOverlay === 'Type beheer') {
      if (failureMechanismId === 0) {
        status = 'gebu_status'
      } else if (failureMechanismId === 1) {
        status = 'gekb_status'
      }
      if (properties[status] === 'open') {
        color = '#43e8d8'
      } else if (properties[status] === 'gesloten') {
        color = '#00aedb'
      }
    } else {
      if (failureMechanismId === 0) {
        status = `gebu_status_${momentId}`
      } else if (failureMechanismId === 1) {
        status = `gekb_status_${momentId}`
      }
      if (properties[status] === 'open voldoet') {
        color = '#43e8d8'
      } else if (properties[status] === 'gesloten voldoet') {
        color = '#00aedb'
      }
    }
    return { color: color, status: properties[status], length: properties.length }
  }

  getFeatureColor = (failureMechanismId, status, properties) => {
    const { moment } = this.props
    const momentId = this.getMoment(moment.index).index
    let fieldName = `gebu_${status}_${momentId}`
    if (failureMechanismId == 1) {
      fieldName = `gekb_${status}_${momentId}`
    }
    let color = '#000000'
    if (properties[fieldName] <= 2) {
      color = '#00cc00'
    } else if (properties[fieldName] > 2) {
      color = '#ff0000'
    }
    return { color: color, status: properties[fieldName], length: properties.length }
  }

  getMarkerColor = (name, failureMechanismId, int, index) => {
    const { moment } = this.props
    const { array } = this.state
    let momentId = null
    if (!index) {
      momentId = this.getMoment(moment.index).index
    } else {
      momentId = index
    }

    let type = failureMechanismId === 0 ? type = 'gebu' : type = 'gekb'
    let status = int === 0 ? status = 'open' : status = 'gesloten'

    const filtered = array.filter(e => e.name === name)[failureMechanismId]
    let icon = ''
    if (filtered[`${type}_${status}_${momentId}`] <= 2) {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" fill="#00cc00" class="svg-icon-svg" style="width:23px; height:23px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="none" fill="white" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
    } else {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" fill="#ff0000" class="svg-icon-svg" style="width:23px; height:23px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="none" fill="white" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg>'
    }
    return icon
  }

  updateLines = (index, key) => {
    const layerGroup = this.mapObject.getLayerObject('vakindelingen')
    const that = this
    let markers = []
    if (!layerGroup) return null
    layerGroup.eachLayer(sectionLayer => {
      if (!(sectionLayer instanceof L.Polyline)) {
        sectionLayer.eachLayer(layer => {
          layer.setStyle({ color: this.getFeatureStatus(layer.options.failureMechanismId, layer.options.properties, index, key).color })
        })
      }
    })
    this.mapObject.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        markers.push(layer.feature.properties)
        const momentStyle = {
          "iconSize": { x: 23, y: 23 },
          "html": that.getMarkerColor(layer.feature.properties.vak, layer.feature.properties.failuremechanismid, layer.feature.properties.status, index),
          // svg-icon-alt = pointer-events: none
          "className": 'svg-icon-alt'
        }
        layer.setIcon(layer.defaultOptions.iconFactory(momentStyle))
      }
    })
    this.setState({ markers })
  }

  // Called when the map is loaded
  // mapObject contains a refrence to the map instance
  setMap = (mapObject) => {
    const { application } = this.props
    const layers = application.config.map.overlays
    this.mapObject = mapObject
    layers.forEach(layer => {
      if (layer.view === 'hhnk' || layer.view === 'hhnkwms') {
        layer.data = null
        this.props.dispatch(asyncActions.addOverlay(this.mapObject, layer))
          .then(data => {
            if (layer.key === 'vakindelingen') {
              const sectionLines = L.layerGroup();
              const layerGroup = this.mapObject.getLayerObject('vakindelingen')
              const failureMechanismIds = [0, 1]

              const lineWeight = 6
              const lineWidth = failureMechanismIds.length * (lineWeight + 1)

              let array = []
              if (layerGroup) {
                layerGroup.eachLayer(sectionLayer => {
                  const sectionCoords = L.GeoJSON.coordsToLatLngs(sectionLayer.feature.geometry.coordinates)
                  for (let j = 0; j < failureMechanismIds.length; j++) {
                    const sectionLine = L.polyline(sectionCoords, {
                      failureMechanismId: j,
                      properties: sectionLayer.feature.properties,
                      weight: lineWeight,
                      opacity: 1,
                      smoothFactor: 1.10,
                      offset: j * (lineWeight + 1) - (lineWidth / 2) + ((lineWeight + 1) / 2)
                    }).addTo(sectionLines)
                    array.push(sectionLayer.feature.properties)
                    const color = this.getFeatureStatus(j, sectionLayer.feature.properties).color
                    sectionLine.setStyle({
                      color: color
                    })
                    this.setState({ array })
                    sectionLine.on('click', () => this.onClickSection(sectionLayer.feature))
                  }
                })
                layerGroup.addLayer(sectionLines)
              }
            }
          })
          .then(a => { this.updateLines() })
      }
      if (!layer.active) {
        this.props.dispatch(asyncActions.hideLayer(this.mapObject, layer.key))
      }
    })
  }

  setView = (viewObject) => {
    this.setState({
      viewObject: viewObject
    }, () => {
      this.updateVega()
      this.updateVegaData(viewObject, this.state.activeStep)
    })
  }

  setSecondView = (viewObject) => {
    this.setState({
      secondViewObject: viewObject
    }, () => {
      this.updateVega()
      this.updateVegaData(viewObject, this.state.activeStep)
    })
  }
  
  handleResize = (width, height, vegaSpec) => {
    const { viewObject, secondViewObject } = this.state
    this.setState({ graph: { key: vegaSpec.key, width: width, height: height, paddingTB: vegaSpec.paddingTB, paddingRL: vegaSpec.paddingRL } })
    if (viewObject) {
      if (width <= 700) {
        this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'legend_orient', value: 'bottom' }))
        this.props.dispatch(asyncActions.sendSignal(secondViewObject, { signalName: 'legend_orient', value: 'bottom' }))
      } else {
        this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'legend_orient', value: 'right' }))
        this.props.dispatch(asyncActions.sendSignal(secondViewObject, { signalName: 'legend_orient', value: 'right' }))
      }
    }
    this.updateVega()
  }

  updateVegaData = (viewObject, activeStep) => {
    const { moment } = this.props
    const momentId = this.getMoment(moment.index).index
    const { features, secondViewObject } = this.state
    let type = 'gebu'
    let view = viewObject
    if (activeStep === 2) {
      type = 'gekb'
      view = secondViewObject
    }
    const options = [
      [`${type}_open_2023`, type, 'open', 2023],
      [`${type}_open_2050`, type, 'open', 2050],
      [`${type}_open_2100`, type, 'open', 2100],
      [`${type}_gesloten_2023`, type, 'gesloten', 2023],
      [`${type}_gesloten_2050`, type, 'gesloten', 2050],
      [`${type}_gesloten_2100`, type, 'gesloten', 2100]
    ]
    let array = []
    options.map(option => {
      array.push(Object.keys(features.properties).filter(key => option.includes(key)).reduce((obj, key) => {
        obj[key] = features.properties[key]
        return { failuremechanism: option[1], condition: option[2], datetime: option[3], value: obj[option[0]], jaar: momentId }
      }, {}))
    })
    if (!features) return null
    return (
      this.props.dispatch(updateVegaData(view, 'risk', array))
    )
  }

  updateVega = () => {
    const { graph, secondViewObject, viewObject } = this.state
    if (!viewObject || !secondViewObject) return null
    this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'width', value: graph.width - graph.paddingRL }))
    this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'height', value: graph.height - graph.paddingTB }))
    this.props.dispatch(asyncActions.sendSignal(secondViewObject, { signalName: 'width', value: graph.width - graph.paddingRL }))
    this.props.dispatch(asyncActions.sendSignal(secondViewObject, { signalName: 'height', value: graph.height - graph.paddingTB }))
    if (graph.width - graph.paddingRL <= 700) {
      this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'legend_orient', value: 'bottom' }))
      this.props.dispatch(asyncActions.sendSignal(secondViewObject, { signalName: 'legend_orient', value: 'bottom' }))
    } else {
      this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'legend_orient', value: 'right' }))
      this.props.dispatch(asyncActions.sendSignal(secondViewObject, { signalName: 'legend_orient', value: 'right' }))
    }
  }

  onBaseLayerChange = (baselayer, active) => {
    if (!active) {
      this.props.dispatch(asyncActions.hideLayer(this.mapObject, baselayer.key))
    }
    else {
      this.props.dispatch(asyncActions.showLayer(this.mapObject, baselayer.key))
    }
  }

  onOverlayLayerChange = (overlay, active) => {
    const { moment } = this.props
    if (!active) {
      this.props.dispatch(asyncActions.hideLayer(this.mapObject, overlay.key))
    }
    else {
      this.props.dispatch(asyncActions.showLayer(this.mapObject, overlay.key))
    }
    this.onMomentChange(moment.index)
  }

  // TODO
  leafletControls = (application) => {
    if (this.state.leafletControls === 0) {
      if (application.config.openDrawers) {
        application.config.openDrawers.map(drawer => {
          let leafletControls = Array.from(document.getElementsByClassName(`leaflet-${drawer}`))
          let leafletBottom = Array.from(document.getElementsByClassName('leaflet-bottom'))
          leafletControls.map(control => {
            if (window.innerWidth >= 600) {
              if (drawer === 'left') {
                control.classList.add('moveL')
              } else {
                control.classList.add('moveR')
              }
            }
            if (window.innerWidth <= 600) {
              leafletBottom.map(bottom => {
                bottom.classList.add('moveBHhnk')
              })
            }
            this.setState({ leafletControls: 1 })
          })
        })
      }
    }
  }

  onMomentChange = (index) => {
    const moment = this.getMoment(index).index
    this.props.dispatch({ type: actions.SET_MOMENT_INDEX, index: index })
    this.updateLines(moment)
  }

  toggleDrawer = (type) => {
    const { drawers } = this.props
    const leafletControls = Array.from(document.getElementsByClassName(`leaflet-${type}`))
    const drawer = `DRAWER_${type.toUpperCase()}_STATE`
    this.props.dispatch({
      type: actions[drawer],
      open: drawers[type] === true ? false : true
    })
    leafletControls.map(control => {
      if (type === 'left') {
        control.classList.toggle('moveL')
      } else if (type === 'right') {
        control.classList.toggle('moveR')
      }
    })
  }

  openDrawerLeft = () => {
    const htmlCollection = document.getElementsByClassName('leaflet-left')
    let leafletControls = Array.from(htmlCollection)

    this.props.dispatch({
      type: DRAWER_LEFT_STATE,
      open: true
    })
    leafletControls.map(control => (
      control.classList.remove('moveL')
    ))
  }

  closeDrawerLeft = () => {
    const htmlCollection = document.getElementsByClassName('leaflet-left')
    let leafletControls = Array.from(htmlCollection)

    this.props.dispatch({
      type: DRAWER_LEFT_STATE,
      open: false
    })
    leafletControls.map(control => (
      control.classList.add('moveL')
    ))
  }

  openDrawerRight = () => {
    const htmlCollection = document.getElementsByClassName('leaflet-right')
    let leafletControls = Array.from(htmlCollection)

    this.props.dispatch({
      type: DRAWER_RIGHT_STATE,
      open: true
    })
    leafletControls.map(control => (
      control.classList.add('moveR')
    ))
  }

  closeDrawerRight = () => {
    const htmlCollection = document.getElementsByClassName('leaflet-right')
    let leafletControls = Array.from(htmlCollection)

    this.props.dispatch({
      type: DRAWER_RIGHT_STATE,
      open: false
    })
    leafletControls.map(control => (
      control.classList.remove('moveR')
    ))
  }

  openDialog = (key) => {
    let openModals = this.state.openModals
    console.log('key', key)
    switch (key) {
      case 'Belastingen':
        this.setState({openModals: []})
        this.props.dispatch({type: actions.SCENARIO_DIALOG_STATE, open: true})
        break
      case 'Scenario':
        this.setState({openModals: []})
        this.props.dispatch({type: actions.DRAWER_SCENARIO_STATE, open: true})
        break
      case 'Beheerdersoordeel':
      case 'Maatregelen':
      case 'Onzekerheden':
      case 'hkv':
      default:
        this.setState({openModals: []})
        this.props.dispatch({type: actions.HKV_DIALOG_STATE, open: true})
        break
      case 'Basisveiligheid':
      case 'Analyse':
      case 'MultiAnalyse':
        const temp = openModals.filter(modal => modal[key])
        // alleen in array pushen wanneer hij nog niet in de array staat
        if (temp.length == 0) {
          openModals.push({[key]: true})
        }
        this.setState({openModals: openModals})
        this.props.dispatch({type: actions.HKV_DIALOG_STATE, open: {modals: openModals}})
        break
    }
  }

  // closeDialog = (key) => {
  //   const type = `${key.toUpperCase()}_DIALOG_STATE`
  //   this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, type: null })
  //   this.props.dispatch({ type: type, open: false })
  //   // resetten van vegaSpec & hkv dialog type
  //   this.props.dispatch({ type: actions.SET_VEGA_SPECIFICATION, specification: null })
  //   this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, value: null })
  // }

  applyMaatregel = (states, features) => {
    this.setState({ states, features: features })
  }

  createSwipeableViews = (filter, features, type) => {
    const { application, dialogs } = this.props
    const { activeStep } = this.state
    const vegaSpec = application.config.vega.filter(spec => spec.key === filter)[0]
    if (!this.props.vega.specs) {
      this.props.dispatch(asyncActions.getVegaSpecification(this.props.url, vegaSpec.specName))
        .then(spec => {
          vegaSpec.json = spec.specification
        })
    }
    return (
      <SwipeableViews
        index={activeStep}
        className={'swipeableview'}
        onChangeIndex={this.handleStepChange}
      >
        <div className={'swipeableview-slide'}>
          <SectionStatusHhnk features={features} getFeatureColor={this.getFeatureColor} getFeatureStatus={this.getFeatureStatus} getMoment={this.getMoment} onApply={this.applyMaatregel} refreshMap={this.updateLines} state={this.state} type={type} />
        </div>
        <div className={'swipeableview-slide'}>
          <HKVVega
            application={application}
            setView={this.setView}
            // specs={vegaSpec.spec}
            specs={this.props.vega.specs}
          />
          <ResizeObserver
            onResize={(rect) => {
              this.handleResize(rect.width, rect.height, vegaSpec)
            }}
          />
        </div>
        <div className={'swipeableview-slide'}>
          <HKVVega
            application={application}
            setView={this.setSecondView}
            // specs={vegaSpec.spec}
            specs={this.props.vega.specs}
          />
          <ResizeObserver
            onResize={(rect) => {
              this.handleResize(rect.width, rect.height, vegaSpec)
            }}
          />
        </div>
      </SwipeableViews>
    )
  }

  renderDialogContent = (dialog) => {
    const { application, dialogs, theme } = this.props
    if (!dialogs.type) return <p>geen data</p>
    // TODO
    // - values van selects
    return dialog.views.map((view, index) => {
      switch (view.type) {
        case 'messaging':
        case 'disclaimer':
          return (
            <div className='dialog-content' key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', height: view.type === 'messaging' ? 'unset' : '100%' }}>
              <Typography variant="body2" dangerouslySetInnerHTML={this.createMarkup(process.env.type === 'app' ? view.contentApp : view.contentWeb)} />
              {view.switch && <div style={{ display: 'flex', marginTop: theme.spacing(1) }}>
                <Switch
                  checked={application.subscription.active}
                  onChange={() => this.toggleSubscription(application.subscription.token)}
                  color="primary"
                />
                <Typography variant="body2" style={{ alignSelf: 'center', marginLeft: theme.spacing(1) }}>Berichtgeving</Typography>
              </div>}
            </div>
          )
        default:
          return <p>default dialog content</p>
      }
    })
  }

  selectStart = (menuItem) => {
    this.props.dispatch({ type: actions.START_DIALOG_STATE, open: false })
    if (menuItem.label === 'What-if inzicht' && window.innerWidth > 600) {
      this.props.dispatch({ type: actions.DRAWER_SCENARIO_STATE, open: true })
    }
    this.props.dispatch({ type: actions.SET_MENU_INDEX, index: menuItem.index })
    this.props.dispatch({ type: actions.SET_MENU_LABEL, label: menuItem.label })
  }

  renderLegend = () => {
    const { classes } = this.props
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <ExpansionPanel defaultExpanded className={classes.expansionPanel}>
          <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
            <FormLabel focused={false} component="legend">Legend</FormLabel>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
            {this.renderGeojsonLegend()}
            {this.renderWmsLegend()}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </FormControl>
    )
  }

  renderGeojsonLegend = () => {
    const { classes, theme } = this.props
    const { activeView } = this.state
    const legenda = [['open', '#43e8d8'], ['gesloten', '#00aedb']]
    if (activeView === 'Eisen beheer') {
      return null
    } else {
      return (
        <div>
          <Typography style={{ margin: `${theme.spacing(1)}px 0` }} variant='body2'>Status</Typography>
          {legenda.map((legend, index) => {
            return <Button key={index} size={'small'} className={classes.legendbutton} style={{ 'background': legend[1], marginRight: theme.spacing(1) }}>{legend[0]}</Button>
          })}
        </div>
      )
    }
  }

  renderWmsLegend = () => {
    const { theme, overlays } = this.props
    const layers = overlays.wms.layers.filter(layer => layer.active === true)
    return layers.map((layer, index) => {
      let url = encodeURI(`${layer.url}?service=WMS&version=1.1.0&request=GetLegendGraphic&transparent=true&height=20&Format=image/png&Style=${layer.styles[0]}&layer=${layer.workspace}:${layer.layer}&LEGEND_OPTIONS=forceLabels:on;fontSize:14;fontColor:0x111111;fontName:Arial,Helvetica,sans-serif;bgColor:0xFFFFEE`)
      return (
        <React.Fragment key={index}>
          <Typography style={{ margin: `${theme.spacing(1)}px 0` }} variant='body2' >{layer.name}</Typography>
          <img style={{ width: 'fit-content' }} src={url} />
        </React.Fragment>
      )
    })
  }

  handleStepChange = (type) => {
    const { viewObject } = this.state
    if (type != 'next') {
      this.setState(prevState => ({ activeStep: prevState.activeStep - 1 }))
      this.updateVegaData(viewObject, this.state.activeStep - 1)
    } else {
      this.setState(prevState => ({ activeStep: prevState.activeStep + 1 }))
      this.updateVegaData(viewObject, this.state.activeStep + 1)
    }
  }

  createMarkup = (text) => {
    return { __html: text }
  }

  selecteerTypeBeheer = (key) => {
    const { grouplayers, moment } = this.props
    this.closeDialog()
    const momentId = this.getMoment(moment.index).index
    if (key === 'Disclaimer') {
      this.openDialog(key)
      this.props.dispatch({type: actions.HKV_DIALOG_TYPE, value: key})
    } else {
      this.setState({activeView: key})
    }
    let leafletControls = Array.from(document.getElementsByClassName('leaflet-left'))
    leafletControls.map(control => (
      control.classList.toggle('moveL')
    ))
    const overlay = grouplayers.items.find(layer => layer.key === 'beheer')
    this.onOverlayLayerChange(overlay, key === 'Type beheer' ? true : false)
    this.updateLines(momentId, key)
  }

  render() {
    const { appid, application, classes, database, dialogs } = this.props
    const { activeStep, activeView } = this.state
    // Make sure application info is loaded!
    if (!database.appinfo.name) return null
    let icon = `/static/images/${application.config.schema}/favicon.ico`
    if (process.env.type === 'app') {
      icon = `./static/images/${application.config.schema}/favicon.ico`
    }
    const dialog = application.config.dialogs.find(dialog => dialog.key === dialogs.type)
    return (
      <React.Fragment>
        <Head>
          <title>{application.config.name}</title>
          {icon && <link rel="shortcut icon" type="image/x-icon" href={icon} />}
        </Head>
        <MapLayout>
          {database.loading && <LinearProgress className={classes.progress} />}
          <Fab
            className={classes.button}
            color="primary"
            onClick={() => this.toggleDrawer('left')}
          >
            <ChevronRightIcon />
          </Fab>
          <Fab
            className={classes.button}
            color="primary"
            onClick={() => this.toggleDrawer('right')}
          >
            <ChevronLeftIcon />
          </Fab>
          {application.config.startMenuActive === true &&
            <StartMenu onClick={this.selectStart} />
          }
          <HKVMap
            setMap={this.setMap}
            application={application}
            onload={this.leafletControls(application)}
          />
          <EmbankmentStatusHhnk getMoment={this.getMoment} state={this.state} type={activeView} />
          <MomentStepper onMomentChange={this.onMomentChange} type='hhnk' />
          <DrawerLeft
            onClose={() => this.toggleDrawer('left')}
            onItemClick={this.selecteerTypeBeheer}
            url={window.location.pathname}
          />
          <SectionDialogHhnk
            activeStep={activeStep}
            appid={appid}
            createSwipeableViews={this.createSwipeableViews}
            onClose={this.closeDialog}
            getFeatureStatus={this.getFeatureStatus}
            onChange={this.handleStepChange}
            onResize={this.handleResize}
            type={activeView}
          />
          <HkvDialog
            dialog={dialog}
            // disabled={disabled}
            // handleApply={this.temp}
            // onClose={this.closeDialog}
            handleClick={this.handleClick}
            // onCloseModal={this.closeModal}
            renderDialogContent={this.renderDialogContent}
            // renderModalContent={this.renderModalContent}
            // handleDialogTitleChange={this.handleDialogTitleChange}
            // selectedOptions={selectedOptions}
          />
          <DrawerRight
            onClose={() => this.toggleDrawer('right')}
            onOverlayLayerChange={this.onOverlayLayerChange}
            onBaseLayerChange={this.onBaseLayerChange}
            renderLegend={this.renderLegend}
            title={'Kaartlagen'}
            basetitle={'Achtergrond'}
          />
        </MapLayout>
      </React.Fragment>
    )
  }
}

ContinuInzichtHhnk = withStyles(styles, { withTheme: true })(ContinuInzichtHhnk)
export default connect(state => state)(ContinuInzichtHhnk)
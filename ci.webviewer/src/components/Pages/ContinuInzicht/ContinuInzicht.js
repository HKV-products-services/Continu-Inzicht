import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import asyncActions from '../../../state/async-actions'
import * as actions from '../../../state/actions'

import { getUrl } from '../../../state/async-actions/database/mangrove'

import AdministratorTable from '../../AdministratorTable'
import BlockVega from '../../BlockVega'
import AreaTable from '../../AreaTable'
import ArrowDownIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpIcon from '@material-ui/icons/ArrowUpward'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import CircularProgress from '@material-ui/core/CircularProgress'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import DrawerLeft from '../../DrawerLeft'
import DrawerRight from '../../DrawerRight'
import DrawerScenario from '../../DrawerScenario'
import EmbankmentStatus from '../../EmbankmentStatus'
import Fab from '@material-ui/core/Fab'
import FormControl from '@material-ui/core/FormControl'
import HkvDialog from '../../mangrove/HkvDialog'
import InputLabel from '@material-ui/core/InputLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import LocationIcon from '@material-ui/icons/LocationOn'
import LocationOffIcon from '@material-ui/icons/LocationOff'
import MapLayout from '../../MapLayout'
import MeasureTable from '../../MeasureTable'
import MenuItem from '@material-ui/core/MenuItem'
import ModalTable from '../../ModalTable'
import MomentStepper from '../../MomentStepper'
import ResizeObserver from 'react-resize-observer'
import ScenarioDialog from '../../ScenarioDialog'
import ScenarioDialogGrave from '../../ScenarioDialogGrave'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import StartMenu from '../../StartMenu'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import WaterlevelRemote from '../../WaterlevelRemote'
import WaterlevelTable from '../../WaterlevelTable'
import WarningIcon from '@material-ui/icons/WarningRounded'

import { i18n, withNamespaces } from '../../../i18n'

import { roundFailure } from '../../../lib'
import { exportJsonToCSV } from '../../../lib/utils'

import { getVegaData } from '../../../state/async-actions/vega'

const HKVVega = dynamic(import('../../HKVVega'), { ssr: false })
const HKVMap = dynamic(import('../../HKVMap'), { ssr: false })

const styles = theme => ({
  progress: {
    position: 'absolute',
    zIndex: 999,
    width: '100%'
  },
  blockScreen: {
    position: 'absolute',
    zIndex: 9999,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
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
  vegaContainer: {
    width: '100%',
    height: '100%',
  },
  hidden: {
    visibility: 'hidden'
  },
  formControl: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    float: 'left',
    [theme.breakpoints.up('xs')]: {
      flexGrow: 1,
      minWidth: 'calc(180px / 2)'
    },
    [theme.breakpoints.up('sm')]: {
      flexGrow: 0,
      minWidth: 180
    },
    '&:last-of-type': {
      marginRight: theme.spacing(1),
      [theme.breakpoints.up('xs')]: {
        minWidth: 'auto'
      },
      [theme.breakpoints.up('sm')]: {
        minWidth: 110
      }
    }
  },
  oneHalf: {
    display: 'flex',
    flexDirection: 'column',
    width: `calc(50% - ${theme.spacing(1)}px)`,
    height: '100%'
  },
  block: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: '#fafafa',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    '&:last-of-type': {
      marginBottom: 0
    }
  },
  tableHead: {
    color: theme.palette.grey[200],
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-of-type': {
      borderRight: 0
    }
  },
  tableCell: {
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-of-type': {
      borderRight: 0
    }
  },
  analyseInputs: {
    marginLeft: theme.spacing(1),
    minWidth: 70,
    '&:first-of-type': {
      marginLeft: 0,
      minWidth: 160
    },
    '&:last-of-type': {
      minWidth: 0
    }
  },
  input: {
    fontSize: 'inherit',
    marginBottom: theme.spacing(0.5)
  },
  table: {
    background: 'white',
    boxShadow: '1px 0px 10px rgba(0,0,0,0.3)'
  }
})

class ContinuInzicht extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize.bind(this)
    this.state = {
      analyseParameters: [],
      contourplot: { width: null, height: null, paddingTB: null, paddingTB: null },
      dialog: null,
      dialogs: {
        type: null
      },
      expertjudgements: [],
      failuremechanismId: 1,
      graph: { width: null, height: null, paddingTB: null, paddingTB: null },
      leafletControls: 0,
      mapKey: 'main',
      measures: [],
      openModals: [],
      temp: null,
      vegaSpec: null,
      viewObject: null,
      kbacosts: null,
      temparray: []
    }
    this.mapObject = {}
    this.viewObject = {}
    this.props.dispatch(asyncActions.getSimulation(process.env.webserver, this.props.appid))
      .then(() => {
        this.props.dispatch(asyncActions.setApplicationConfig(this.props.url)).then((application) => {
          if (process.env.type === 'app') {
            application.config = JSON.parse(application.statusText).application[0]
          }
          i18n.changeLanguage(application.config.locale)
          this.props.dispatch(asyncActions.getConditions(process.env.webserver, application.config.id, 'section'))

          if (application.config.openDrawers) {
            application.config.openDrawers.map(drawer => {
              const type = `DRAWER_${drawer.toUpperCase()}_STATE`
              this.props.dispatch({ type: actions[type], open: window.innerWidth <= 600 ? false : true })
            })


            this.props.dispatch(asyncActions.getAppInfo(process.env.webserver, 'ci', application.config.id, 2))
          }

          this.props.dispatch({ type: actions.SET_ACTIVE_VIEW, active: 'waterkeringen' })

          // ophalen KBA settings
          this.props.dispatch(asyncActions.getSettings(process.env.webserver, application.config.id))

          if (application.config.startMenuActive === true) {
          } else if (application.config.startMenu.active === false) {
            this.props.dispatch({ type: actions.START_DIALOG_STATE, open: false })
          }

          this.props.dispatch({ type: actions.SET_MENU_INDEX, index: 0 })
        })
      })
  }

  componentDidMount = () => {
    document.addEventListener("deviceready", this.onDeviceReady.bind(this), true)
  }

  onDeviceReady() {
    navigator.splashscreen.hide()
  }

  // appinfo binnen halen (voor lengtes van statussen)
  getAppInfo = (mapObject) => {
    const { appid } = this.props
    this.props.dispatch(asyncActions.getAppInfo(process.env.webserver, 'ci', appid))
      .then(() => { this.refreshMap(mapObject) })
  }

  getMoment = (index) => {
    const { moments } = this.props.database.appinfo
    return moments[index]
  }

  getEnsembleId = () => {
    const { uncertainty } = this.props
    return uncertainty.id
  }

  onItemClick = (event) => {
    this.openDialog(event)
    // TODO
    // - if statements weghalen
    if (event === 'Scenario' || event === 'Belastingen') return null
    this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, value: event })
    if (event === 'Analyse' || event === 'Basisveiligheid' || event === 'MultiAnalyse') return null
    this.props.dispatch({ type: actions.DRAWER_LEFT_STATE, open: false })
    const htmlCollection = document.getElementsByClassName('leaflet-left')
    let leafletControls = Array.from(htmlCollection)
    leafletControls.map(control => (
      control.classList.toggle('moveL')
    ))
  }

  onClickLayer = (event) => {
    const { appid, application, dialogs, moment } = this.props
    // Niet uitvoeren wanneer dialog al open is
    if (dialogs.state) return null
    const featureId = event.target.feature.id
    const featureName = event.target.feature.properties.name
    const momentId = this.getMoment(moment.index).index
    let ensembleId = this.getEnsembleId()
    const pane = event.target.options.pane
    let type = null
    switch (pane) {
      case 'dijkvakken':
        type = 'section'
        if (featureId == 11) {
          ensembleId = 5
        } else if (featureId == 21) {
          ensembleId = 8
        }
        this.props.dispatch(asyncActions.getSectionById(process.env.webserver, appid, featureId, momentId, ensembleId))
        break
      case 'markerPane':
      case 'Point':
        type = 'station'
        this.props.dispatch(asyncActions.getStationById(process.env.webserver, appid, featureId, ensembleId))
        break
      case 'RGETR':
      case 'RSL':
      case 'RSCH':
      case 'RPLPF':
        type = 'area'
        this.props.dispatch(asyncActions.getAreaById(process.env.webserver, appid, featureId, momentId))
        break
    }
    const vegaSpec = application.config.vega.find(spec => spec.key === type)
    this.setState({ vegaSpec: vegaSpec })
    this.openDialog(type)
    this.props.dispatch({ type: actions.SET_FEATURE_ID, id: featureId })
    this.props.dispatch({ type: actions.SET_FEATURE_NAME, name: featureName })
    this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, value: type })
    this.props.dispatch({ type: actions.DIALOG_LOADING_STATE, loading: true })
  }

  onSelectBoxZoomFeatures = (event) => {
    const selectedLayers = []
    this.mapObject.eachLayer(function (layer) {
      if ((layer instanceof L.Marker) || (layer instanceof L.CircleMarker)) {
        if (event.boxZoomBounds.contains(layer.getLatLng())) {
          selectedLayers.push(layer)
        }
      } else if (layer instanceof L.Polyline) {
        const points = layer.getLatLngs()
        let pointsInPolygon = true
        let i = 0
        while (i < points.length && pointsInPolygon) {
          pointsInPolygon = event.boxZoomBounds.contains(points[i])
          i++
        }
        if (pointsInPolygon) {
          selectedLayers.push(layer)
        }
      }
    })
    return selectedLayers
  }

  getCurrentStyleField = (index) => {
    const { moments } = this.props.database.appinfo
    const { uncertainty } = this.props
    const moment = moments[index]
    const code = uncertainty.code.toLowerCase()

    return `${code}_${moment.name}`
  }

  getFeatureColor = (layer, index) => {
    const styleField = this.getCurrentStyleField(index)
    let color = null
    let colorIndex = `color${index}`
    if (layer.feature.properties[colorIndex]) {
      color = layer.feature.properties[colorIndex]
    } else {
      color = layer.feature.properties[styleField] == null ? '#BDBDBD' : layer.feature.properties[styleField]
    }
    return color
  }

  LightenDarkenColor(col, amt) {
    var usePound = false
    if (col[0] == "#") {
      col = col.slice(1)
      usePound = true
    }

    var num = parseInt(col, 16)
    var r = (num >> 16) + amt
    if (r > 255) r = 255
    else if (r < 0) r = 0

    var b = ((num >> 8) & 0x00FF) + amt
    if (b > 255) b = 255
    else if (b < 0) b = 0

    var g = (num & 0x0000FF) + amt
    if (g > 255) g = 255
    else if (g < 0) g = 0

    return (usePound ? '#' : '') + String('000000' + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
  }

  // if lighten/darker color <= 5 add 00 after #
  getFeatureColorHighlight = (layer, index) => {
    const { moments } = this.props.database.appinfo
    const { uncertainty } = this.props
    const moment = moments[index]
    const code = uncertainty.code.toLowerCase()
    let color = null
    let colorIndex = `color${index}`
    if (layer.feature.properties[colorIndex]) {
      color = layer.feature.properties[colorIndex]
    } else {
      color = layer.feature.properties[`${code}_${moment.name}`] == null ? '#BDBDBD' : layer.feature.properties[`${code}_${moment.name}`]
    }
    const darken = this.LightenDarkenColor(color, -60)
    return darken
  }

  onMouseOver = (event) => {
    const layer = event.target
    const { moment } = this.props
    switch (layer.feature.geometry.type) {
      case 'MultiLineString':
        layer.setStyle({ color: this.getFeatureColorHighlight(layer, moment.index) })
        this.props.dispatch({ type: actions.SET_SELECTED_FEATURE, selected: layer.feature.id })
        // scroll table to correct id
        const element = document.getElementById(layer.feature.id)
        element == null ? null : element.scrollIntoView({ behavior: "smooth", block: "center" })
        break
      case 'Point':
        layer.setStyle({ color: this.getFeatureColorHighlight(layer, moment.index) })
        break
      case 'MultiPolygon':
        layer.setStyle({ fillColor: this.getFeatureColorHighlight(layer, moment.index) })
        layer.setStyle({ color: this.getFeatureColorHighlight(layer, moment.index) })
        break
    }
  }

  onMouseOut = (event) => {
    const layer = event.target
    const { moment } = this.props
    switch (layer.feature.geometry.type) {
      case 'MultiLineString':
        layer.setStyle({ color: this.getFeatureColor(layer, moment.index) })
        // this.props.dispatch({ type: actions.SET_SELECTED_FEATURE, selected: null })
        break
      case 'Point':
        layer.setStyle({ color: this.getFeatureColor(layer, moment.index) })
        break
      case 'MultiPolygon':
        layer.setStyle({ fillColor: this.getFeatureColor(layer, moment.index) })
        layer.setStyle({ color: this.getFeatureColor(layer, moment.index) })
        break
    }
  }

  setMapObjectIndex = (dialog) => {
    let index = 0
    if (dialog && this.state.mapKey === dialog.key) {
      dialog.views.forEach((view, i) => {
        index = i
      })
    }
    return index
  }

  setBasicSafetyValues = (basicSafeties, features) => {
    basicSafeties.map(basicsafety => {
      basicsafety.withoutMeasure = features.filter(feature => feature.properties.color0 === basicsafety.color).length
      basicsafety.withMeasure = features.filter(feature => feature.properties.color1 === basicsafety.color).length
    })
  }

  // Called when the map is loaded
  // mapObject contains a refrence to the map instance
  setMap = (mapObject) => {
    const { appid, application, area, database, dialogs, uncertainty, views } = this.props
    const dialog = application.config.dialogs.find(dialog => dialog.key === dialogs.type)
    const layers = application.config.map.overlays
    let layersFiltered = []
    // Alleen uitvoeren wanneer er een view met het type 'leaflet' is
    if (dialog && dialog.views.find(view => view.type === 'leaflet')) {
      layersFiltered = []
      const allowed = dialog.views.find(view => view.type === 'leaflet').overlays
      allowed.map(layerKey => {
        layersFiltered.push(layers.find(layer => layer.key === layerKey))
        layers.find(layer => layer.key === layerKey).active = false
      })
      layersFiltered[0].active = true
      // TODO
      // - Zet de eerste overlay uit het dialog config (application.json) op active, of geen optie mee
    } else {
      if (views.active === 'gebieden') {
        layers.find(layer => layer.key === area.risico).active = true
      } else if (dialogs.type === 'Basisveiligheid') {
        layers[0].active = false
        layers.find(layer => layer.key === 'areacostsandbenefits').active = true
      } else {
        layers.map(layer => (
          layer.active = false
        ))
        layers[0].active = true
      }
      layersFiltered = layers
    }
    // Eerste van de gefilterede layers op active, in v2 gaat dit weg omdat in v1 geen beheerdersoordeel op gebieden kan worden gezet
    // Wanneer er al een mapObject met dezelfde naam is krijgen de eerst volgende ++
    this.setState({ mapKey: dialogs.state === false ? 'main' : this.state.mapKey === dialogs.type ? `${dialogs.type}${dialog && dialog.views.length - 2}` : dialogs.type }, () => {
      this.mapObject[this.state.mapKey] = mapObject
      if (this.mapObject[this.state.mapKey]) {
        this.mapObject[this.state.mapKey].on('boxzoomend', this.onSelectBoxZoomFeatures)
      }
      this.props.dispatch(asyncActions.getSectionByList(process.env.webserver, appid, [], uncertainty.id, 1))
      layersFiltered.forEach(layer => {
        layer.onClick = this.onClickLayer
        layer.onMouseOver = this.onMouseOver
        layer.onMouseOut = this.onMouseOut
        // met index ipv 0 / 1
        this.props.dispatch(asyncActions.addOverlay(this.mapObject[this.state.mapKey], layer, database.settings.basicSafety, this.setMapObjectIndex(dialog)))
          .then(() => {
            if (layer.key === 'areacostsandbenefits') {
              this.setBasicSafetyValues(database.settings.basicSafety, layer.data.features)
            }
            if (layer.key === 'vakindelingen') {
              const outlines = L.layerGroup()
              const lineBg = L.layerGroup()
              const sectionLines = L.layerGroup()
              const layerGroup = this.mapObject[this.state.mapKey].getLayerObject('vakindelingen')
              const lineWeight = 6
              const lineColors = ['#43e8d8', '#00aedb', '#be29ec', '#ff0000', '#00ff00', '#F000000']
              layerGroup.eachLayer(lineSegment => {
                const segmentCoords = L.GeoJSON.coordsToLatLngs(lineSegment.feature.geometry.coordinates, 1)
                const linesOnSegment = [1, 2, 4, 3]//lineSegment.feature.properties.lines;
                const segmentWidth = linesOnSegment.length * (lineWeight + 1)
                L.polyline(segmentCoords, { color: '#000', weight: segmentWidth + 5, opacity: 1 }).addTo(outlines)
                L.polyline(segmentCoords, { color: '#fff', weight: segmentWidth + 3, opacity: 1 }).addTo(lineBg)
                for (let j = 0; j < linesOnSegment.length; j++) {
                  const offset = j * (lineWeight + 1) - (segmentWidth / 2) + ((lineWeight + 1) / 2)
                  L.polyline(segmentCoords, { color: lineColors[linesOnSegment[j]], color: 'green', weight: lineWeight, opacity: 1, offset: offset }).addTo(sectionLines)
                }
              })
              outlines.addTo(this.mapObject[this.state.mapKey])
              lineBg.addTo(this.mapObject[this.state.mapKey])
              sectionLines.addTo(this.mapObject[this.state.mapKey])
            }
            if (layer.key === 'dijkvakken') {
              const geojson = this.mapObject[this.state.mapKey].getLayerObject('dijkvakken')
              this.setState({ geojson: geojson })
            }
          })
        if (!layer.active) {
          this.props.dispatch(asyncActions.hideLayer(this.mapObject[this.state.mapKey], layer.key))
        }
      })
    })
  }

  // map overlays opnieuw tekenen (met nieuwe kleuren)
  refreshMap = (mapObject) => {
    const { application, moment } = this.props
    const { mapKey } = this.state
    const layers = application.config.map.overlays.filter(overlay => overlay.refresh === true)
    this.mapObject[mapKey] = mapObject
    // this.mapObject[mapKey].on('boxzoomend', this.onSelectBoxZoomFeatures)
    layers.forEach(layer => {
      layer.onClick = this.onClickLayer
      layer.data = null
      this.props.dispatch(asyncActions.removeOverlay(this.mapObject[mapKey], layer))
      this.props.dispatch(asyncActions.addOverlay(this.mapObject[mapKey], layer))
        .then(() => this.onMomentChange(moment.index))
      if (!layer.active) {
        this.props.dispatch(asyncActions.hideLayer(this.mapObject[mapKey], layer.key))
      }
    })
  }

  setView = (viewObject, options, key) => {
    this.viewObject[key] = viewObject
    this.setState({ viewObject: viewObject }, () => {
      this.updateVegaData(viewObject)
      this.updateVega(viewObject)
    })
  }

  setContourView = (contourViewObject) => {
    this.contourViewObject = contourViewObject
    this.setState({
      contourViewObject: contourViewObject
    }, () => {
      this.updateVegaData(contourViewObject)
      this.updateVega(contourViewObject)
    })
  }

  handleResize = (width, height, vegaSpec, key) => {
    const viewObject = this.viewObject[key]
    if (vegaSpec.key === 'contourplot') {
      this.setState({ contourplot: { key: vegaSpec.key, width: width, height: height, paddingTB: vegaSpec.paddingTB, paddingRL: vegaSpec.paddingRL } })
    } else {
      this.setState({ graph: { key: vegaSpec.key, width: width, height: height, paddingTB: vegaSpec.paddingTB, paddingRL: vegaSpec.paddingRL } })
    }
    if (viewObject) {
      if (width <= 700) {
        this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'legend_orient', value: 'bottom' }))
      } else {
        this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'legend_orient', value: 'right' }))
      }
    }
    this.updateVega(viewObject)
  }

  updateVegaData = (viewObject) => {
    const { appid, area, moment, overlays, database } = this.props
    const { graph } = this.state
    let url = null
    let ensembleId = this.getEnsembleId()
    let momentId = this.getMoment(moment.index).index
    let featureId = overlays.id
    let parameters = {}

    switch (graph.key) {
      case "section":
        if (featureId == 11) {
          ensembleId = 5
        } else if (featureId == 21) {
          ensembleId = 8
        }

        parameters = {
          appid: appid,
          id: featureId,
          momentid: momentId,
          ensembleid: ensembleId
        }

        url = getUrl(process.env.webserver, 'ci.appfunctions.GetSectionById', parameters)
  
        return this.props.dispatch(getVegaData(viewObject, "source", url))
      case "station":

        parameters = {
          appid: appid,
          id: featureId,
          ensembleid: ensembleId
        }

        url = getUrl(process.env.webserver, 'ci.appfunctions.getStationById', parameters)

        return this.props.dispatch(getVegaData(viewObject, "source", url))
      case "area":

        parameters = {
          appid: appid,
          id: featureId,
          momentid: momentId
        }

        url = getUrl(process.env.webserver, 'ci.appfunctions.GetAreaById', parameters)

        return this.props.dispatch(getVegaData(viewObject, "source", url))
          .then(() => this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'rp_bind', value: area.risico })))
      case "costbenefit":

        if (viewObject.options) {
          if (viewObject.options.kbaname && database.settings) {
            const kba = database.settings.kba.filter(k => k.name === viewObject.options.kbaname)

            if (kba && kba[0].costs) {

              parameters = {
                appid: 20,
                measurecosts: kba[0].costs,
                victimvalue: 10000
              }

              url = getUrl(process.env.webserver, 'ci.appfunctions.GetCostBenefit', parameters)

              return this.props.dispatch(getVegaData(viewObject, "source_0", url))
                .then(() => this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'executiontime', value: kba[0].executiontime })))
            }
          }
        }
        break;
    }
  }

  updateVega = (viewObject) => {
    const { contourplot, contourViewObject, graph } = this.state
    if (!viewObject) return null
    this.props.dispatch(
      asyncActions.sendSignal(viewObject, { signalName: 'width', value: graph.width - graph.paddingRL })
    )
    this.props.dispatch(
      asyncActions.sendSignal(viewObject, { signalName: 'height', value: graph.height - graph.paddingTB })
    )
    if (!contourplot.width) return null
    this.props.dispatch(
      asyncActions.sendSignal(contourViewObject, { signalName: 'width', value: contourplot.width - contourplot.paddingRL })
    )
    this.props.dispatch(
      asyncActions.sendSignal(contourViewObject, { signalName: 'height', value: contourplot.height - contourplot.paddingTB })
    )
  }

  areaOverlayLayerChange = (event) => {
    const { grouplayers } = this.props
    const { viewObject } = this.state
    this.props.dispatch({ type: actions.SET_AREA_RISK, risk: event.target.value })
    if (!viewObject) return null
    console.log('event', event.target.value)
    this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'rp_bind', value: event.target.value }))
    grouplayers.items.forEach(grouplayer => {
      this.onOverlayLayerChange(grouplayer, false)
    })
    const radioLayers = grouplayers.items.filter(layer => layer.view === "gebieden" && layer.selection === "radio")
    radioLayers.forEach(radioLayer => {
      this.onOverlayLayerChange(radioLayer, radioLayer.key === event.target.value)
    })
  }

  onBaseLayerChange = (baselayer, active) => {
    const { mapKey } = this.state
    if (!active) {
      this.props.dispatch(asyncActions.hideLayer(this.mapObject[mapKey], baselayer.key))
    } else {
      this.props.dispatch(asyncActions.showLayer(this.mapObject[mapKey], baselayer.key))
    }
  }

  onOverlayLayerChange = (overlay, active) => {
    const { moment } = this.props
    const { mapKey } = this.state
    if (!active) {
      this.props.dispatch(asyncActions.hideLayer(this.mapObject[mapKey], overlay.key))
    } else {
      this.props.dispatch(asyncActions.showLayer(this.mapObject[mapKey], overlay.key))
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
          const waterlevelRemote = document.getElementById('waterlevelRemote')
          leafletControls.map(control => {
            if (window.innerWidth >= 600) {
              if (drawer === 'left') {
                if (waterlevelRemote) {
                  waterlevelRemote.classList.add("moveL")
                  waterlevelRemote.classList.add("waterlevelTop")
                }
                control.classList.add('moveL')
              } else {
                control.classList.add('moveR')
              }
            }
            if (window.innerWidth <= 600) {
              leafletBottom.map(bottom => {
                bottom.classList.add('moveB')
              })
            }
            this.setState({ leafletControls: 1 })
          })
        })
      }
    }
  }

  onMomentChange = (index) => {
    this.props.dispatch({ type: actions.SET_MOMENT_INDEX, index: index })
    const { uncertainty } = this.props
    const { mapKey } = this.state
    const moment = this.getMoment(index)
    const code = uncertainty.code.toLowerCase()
    const styleField = `${code}_${moment.name}`
    this.mapObject[mapKey].eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        // Waterstanden
        const value = layer.feature.properties[styleField]
        const iconPath = layer.options.icon.options.iconPath
        const momentStyle = {
          "fillColor": value !== null ? value : "#BDBDBD",
          "color": value !== null ? value : "#BDBDBD",
          "border": '1px solid #000',
          "iconPath": iconPath !== null || iconPath !== undefined ? iconPath : "<path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/><path d='M0 0h24v24H0z' stroke='none' fill='none'/>"
        }
        layer.setIcon(layer.defaultOptions.iconFactory(momentStyle))
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

  onConditionChange = (index) => {
    // als er 1+ mapObjecten zijn beginnen deze pas vanaf mapObject0 te tellen
    let mapObject = this.mapObject[`Basisveiligheid${(index - 1) < 0 ? '' : index - 1}`]
    let colorIndex = `color${mapObject.myKey}`
    mapObject.eachLayer(function (layer) {
      if (layer instanceof L.Polygon) {
        let value = layer.feature.properties[colorIndex]
        const conditionStyle = {
          "fillColor": value !== null ? value : "#BDBDBD",
          "color": value !== null ? value : "#BDBDBD"
        }
        layer.setStyle(conditionStyle)
      }
    })
  }

  toggleDrawer = (type) => {
    const { drawers } = this.props
    const leafletControls = Array.from(document.getElementsByClassName(`leaflet-${type}`))
    const waterlevelRemote = document.getElementById('waterlevelRemote')
    const drawer = `DRAWER_${type.toUpperCase()}_STATE`
    this.props.dispatch({
      type: actions[drawer],
      open: drawers[type] === true ? false : true
    })
    if (waterlevelRemote && type === 'left') {
      waterlevelRemote.classList.toggle('moveL')
      waterlevelRemote.classList.toggle('waterlevelTop')
    }
    leafletControls.map(control => {
      if (type === 'left') {
        control.classList.toggle('moveL')
      } else if (type === 'right') {
        control.classList.toggle('moveR')
      }
    })
  }

  openDialog = (key) => {
    let openModals = this.state.openModals
    switch (key) {
      case 'Belastingen':
        this.setState({ openModals: [] })
        this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, value: null })
        this.props.dispatch({ type: actions.HKV_DIALOG_STATE, open: false })
        this.props.dispatch({ type: actions.SCENARIO_DIALOG_STATE, open: true })
        break
      case 'Scenario':
        this.setState({ openModals: [] })
        this.props.dispatch({ type: actions.DRAWER_SCENARIO_STATE, open: true })
        break
      default:
        this.setState({ openModals: [] })
        this.props.dispatch({ type: actions.HKV_DIALOG_STATE, open: true })
        break
      case 'Basisveiligheid':
      case 'Analyse':
      case 'MultiAnalyse':
        const openModalsLength = openModals.filter(modal => modal[key])
        let modalIndex = openModals.findIndex(e => e.key === key)
        // alleen in array pushen wanneer hij nog niet in de array staat
        if (openModalsLength.length == 0) {
          openModals.push({ [key]: true, key: key })
        } else {
          openModals.splice(modalIndex, 1)
        }
        this.setState({ openModals: openModals })
        this.props.dispatch({ type: actions.HKV_DIALOG_STATE, open: { modals: openModals } })
        break
    }
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
      this.props.dispatch({ type: actions.HKV_DIALOG_STATE, open: false })
      this.props.dispatch({ type: type, open: false })
    }
    this.setState({ disabled: false }, () => {
      this.setMap(this.mapObject['main'])
    })
    // resetten van vegaSpec & hkv dialog type
    this.props.dispatch({ type: actions.SET_VEGA_SPECIFICATION, specification: null })
    this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, value: null })
  }

  closeModal = (index) => {
    let openModals = this.state.openModals
    openModals.splice(index, 1)
    // resetten van map / map layer[0] active maken
    if (openModals.length === 0) {
      this.props.dispatch({ type: actions.HKV_DIALOG_STATE, open: null })
      this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, value: null })
      this.setState({ openModals: openModals }, () => {
        this.setMap(this.mapObject['main'])
      })
    } else {
      this.setState({ openModals: openModals })
      this.props.dispatch({ type: actions.HKV_DIALOG_STATE, open: { modals: openModals } })
    }
  }

  renderTable = (type) => {
    switch (type) {
      case 'area':
        return <AreaTable />
      case 'station':
        return <WaterlevelTable />
      case 'Maatregelen':
        return <MeasureTable
          onChange={this.handleMeasureChange}
          onMouseOver={this.onTableRowOver}
          onMouseOut={this.onTableRowOut}
        />
      case 'Beheerdersoordeel':
        return <AdministratorTable
          disableApply={this.disableApply}
          onChange={this.handleExpertjudgementsChange}
          onClick={this.onTableRowClick}
          onMouseOver={this.onTableRowOver}
          onMouseOut={this.onTableRowOut}
        />
      case 'MultiAnalyse':
      default:
        return <ModalTable
          analyseParameters={this.state.analyseParameters}
        />
    }
  }

  renderModalBlockContent = (block) => {
    const { application, classes, database } = this.props
    switch (block.content) {
      case 'analyse_vega':
        return <BlockVega
          block={block}
          handleResize={this.handleResize}
          setView={this.setView}
          url={this.props.url}
        />
      case 'analyse_inputs':
        if (database.settings) {
          const { settings } = this.props.database
          return block.contents.map((input, index) => {
            let value = 0;
            if (input.class === 'general') {
              const generalSettings = settings.general.filter(k => k.name === input.key)
              if (generalSettings.length > 0) {
                value = generalSettings[0].value
              }
            }
            else {
              const kbaSettings = settings.kba.filter(k => k.name === block.kbaname)
              if (kbaSettings.length > 0) {
                value = kbaSettings[0][input.key]
              }
            }
            return (
              <div key={index} style={{ display: 'flex' }}>
                <Typography className={classes.analyseInputs}>{input.name}</Typography>
                <Typography className={classes.analyseInputs} align="right" color="primary">{value}</Typography>
                <Typography className={classes.analyseInputs}>{input.unit}</Typography>
              </div>
            )
          })
        }
      case 'basisveiligheid_inputs':
        if (database.settings) {
          const { settings } = this.props.database
          return block.contents.map((input, index) => {
            const basicSafetySettings = settings.basicSafety.filter(e => e.to !== null).find(k => k.from === input.key)
            const value = basicSafetySettings.value
            return (
              <div key={index} style={{ display: 'flex' }}>
                <Typography className={classes.analyseInputs}>{input.name}</Typography>
                <Typography className={classes.analyseInputs} align="right" color="primary">{value}</Typography>
                <Typography className={classes.analyseInputs}>{input.unit}</Typography>
              </div>
            )
          })
        }
      case 'map':
        return (
          <div style={{ height: '100%' }}>
            <HKVMap
              setMap={this.setMap}
              application={{ ...application }}
              myOptions={block}
              myKey={block.mapKey}
            />
          </div>
        )
      default:
        break
    }
  }

  disableApply = (state) => {
    this.setState({ disabled: state })
  }

  handleAnalyse = (event) => {
    const failuremechanismId = event.target.value
    const { appid, uncertainty } = this.props
    this.setState({ failuremechanismId: failuremechanismId })
    this.props.dispatch(asyncActions.getSectionByList(process.env.webserver, appid, [], uncertainty.id, failuremechanismId))
  }

  renderError = (section) => {
    this.props.dispatch({ type: actions.DIALOG_LOADING_STATE, loading: false })
    if (section.fragilitycurve && section.fragilitycurve[0] === undefined) {
      return <Typography color="primary" variant="h5" style={{ width: '100%', alignSelf: 'center' }}>Er is geen fragilitycurve aanwezig</Typography>
    } else if (section.failureprobability && section.failureprobability[0] === undefined) {
      return <Typography color="primary" variant="h5" style={{ width: '100%', alignSelf: 'center' }}>Er is geen faalkans aanwezig</Typography>
    } else if (section.fragilitycurve && section.failureprobability && section.fragilitycurve[0] === undefined && section.failureprobability[0] === undefined) {
      return <Typography color="primary" variant="h5" style={{ width: '100%', alignSelf: 'center' }}>Er is geen zowel geen fragilitycurve als faalkans aanwezig</Typography>
    } else {
      return <Typography color="primary" variant="h5" style={{ width: '100%', alignSelf: 'center' }}>Er is geen zowel geen fragilitycurve als faalkans aanwezig</Typography>
    }
  }

  setEnsemble = (event) => {
    const { application, database, moment } = this.props
    const name = event.target.value
    const ensemble = database.appinfo.ensembles.find(e => e.name == name)
    this.props.dispatch({ type: actions.SET_ENSEMBLE_CODE, code: ensemble.code })
    this.props.dispatch({ type: actions.SET_UNCERTAINTY_ID, id: ensemble.id })
    this.props.dispatch({ type: actions.SET_UNCERTAINTY_NAME, name: ensemble.name })
    this.props.dispatch({ type: actions.HKV_DIALOG_STATE, open: false })
    this.props.dispatch({ type: actions.HKV_DIALOG_TYPE, value: null })
    this.props.dispatch(asyncActions.getAppInfo(process.env.webserver, 'ci', application.config.id, ensemble.id))
      .then(() => { this.onMomentChange(moment.index) })
    if (ensemble.code === 'AVG') {
      this.props.dispatch({ type: actions.SET_UNCERTAINTY_ALERT, open: false })
    } else {
      this.props.dispatch({ type: actions.SET_UNCERTAINTY_ALERT, open: true })
    }
  }

  onTableRowClick = (e) => {
    const { moment } = this.props
    const { geojson } = this.state
    if (!geojson) return null
    geojson.eachLayer(layer => {
      const color = this.getFeatureColor(layer, moment.index)
      layer.setStyle({ color: color })
      if (layer.feature.id === e.sectionid) {
        layer.setStyle({ color: this.getFeatureColorHighlight(layer, moment.index) })
      }
    })
  }

  onTableRowOver = (e) => {
    const { moment } = this.props
    const { geojson } = this.state
    if (!geojson) return null
    geojson.eachLayer(layer => {
      const color = this.getFeatureColor(layer, moment.index)
      layer.setStyle({ color: color })
      if (layer.feature.id === e.sectionid) {
        layer.setStyle({ color: this.getFeatureColorHighlight(layer, moment.index) })
      }
    })
  }

  onTableRowOut = () => {
    const { moment } = this.props
    const { geojson } = this.state
    if (!geojson) return null
    geojson.eachLayer(layer => {
      layer.setStyle({ color: this.getFeatureColor(layer, moment.index) })
    })
  }

  handleMeasureChange = measures => {
    this.setState({ measures: measures })
  }

  handleExpertjudgementsChange = expertjudgements => {
    this.setState({ expertjudgements: expertjudgements })
  }

  // Dialog bottom functions
  handleClick = (functionName, index) => {
    const functPtr = this[functionName]
    functPtr(index && index)
  }

  addAnalyse = () => {
    // let analyseParameters = this.props.database.analyseParameters
    let analyseParameters = this.state.analyseParameters
    const analysePlaceholder = {
      "name": "Geef een naam",
      "score": "Geef een score"
    }
    analyseParameters.push(analysePlaceholder)
    this.setState({ analyseParameters: analyseParameters })
    this.props.dispatch({ type: actions.SET_ANALYSE_PARAMETERS, parameters: analyseParameters })
  }

  applySettings = () => {
    this.closeDialog()
    return null
  }

  applyMeasures = () => {
    const { appid } = this.props
    const { measures } = this.state
    const that = this
    this.closeDialog()
    Object.keys(measures).map(function (sectionId) {
      if (measures[sectionId] == null) {
        that.props.dispatch(asyncActions.setSectionMeasure(process.env.webserver, appid, Number(sectionId), 0, 1))
      } else {
        const measureId = measures[sectionId][0]
        const measureSuccessrate = measures[sectionId][1]
        that.props.dispatch(asyncActions.setSectionMeasure(process.env.webserver, appid, Number(sectionId), measureId, Number(measureSuccessrate)))
      }
    })
  }

  applyExpertjudgements = () => {
    const { appid, uncertainty, views } = this.props
    const { expertjudgements } = this.state
    const that = this
    this.closeDialog()
    Object.keys(expertjudgements).map(function (sectionId) {
      let expertjudgement = null
      if (expertjudgements[sectionId] !== null) {
        expertjudgement = expertjudgements[sectionId]
      } else {
        expertjudgement = { id: -99999, faalkans: 0 }
      }
      const f = expertjudgement.faalkans / 100
      if (views.active === 'gebieden') {
        that.props.dispatch(asyncActions.setAreaExpertjudgement(process.env.webserver, appid, Number(sectionId), expertjudgement.id, f))
        that.props.dispatch(asyncActions.getAreaByList(process.env.webserver, appid, []))
      } else {
        that.props.dispatch(asyncActions.setSectionExpertjudgement(process.env.webserver, appid, Number(sectionId), expertjudgement.id, f))
        that.props.dispatch(asyncActions.getSectionByList(process.env.webserver, appid, [], uncertainty.id, 1))
      }
    })
  }

  switchIcon = (conditionfeature, color, block) => {
    switch (conditionfeature) {
      case -1:
        return <ArrowDownIcon className={`dialog-icon-${block.svg.size} ${block.svg.border && 'dialog-icon-border'}`} style={{ color: color }} />
      case 0:
        return <DragHandleIcon className={`dialog-icon-${block.svg.size} ${block.svg.border && 'dialog-icon-border'}`} style={{ color: color }} />
      case 1:
        return <ArrowUpIcon className={`dialog-icon-${block.svg.size} ${block.svg.border && 'dialog-icon-border'}`} style={{ color: color }} />
      default:
        return <DragHandleIcon className={`dialog-icon-${block.svg.size} ${block.svg.border && 'dialog-icon-border'}`} style={{ color: color }} />
    }
  }

  renderDescription = (stationoptions, parameterName, description) => {
    switch (stationoptions.descriptionType) {
      case 1:
        return (
          <div>
            <Typography variant="h5" color="primary" style={{ display: 'inline' }}>
              Deze waterstand komt:
            </Typography>
            <Typography variant="h5" color="primary" style={{ fontWeight: 500, display: 'inline', margin: '0 8px' }}>
              {description}
            </Typography>
            <Typography variant="h5" color="primary" style={{ display: 'inline' }}>
              voor
            </Typography>
          </div>
        )
      case 2:
      default:
        return (
          <div>
            <Typography variant="h5" color="primary" style={{ display: 'inline' }}>
              De status van de {parameterName} is:
            </Typography>
            <Typography variant="h5" color="primary" style={{ fontWeight: 500, display: 'inline', marginLeft: 8 }}>
              {description}
            </Typography>
          </div>
        )
    }
  }

  switchBlockSize = (size) => {
    const { theme } = this.props
    switch (size) {
      case 'full':
      case 'large':
        return '100%'
      case 'three_fourth':
        return `calc(100% / 4 * 3 - ${theme.spacing(1)}px)`
      case 'two_third':
        return `calc(100% / 3 - ${theme.spacing(1)}px)`
      case 'half':
        return `calc(100% / 2 - ${theme.spacing(1)}px)`
      case 'one_third':
        return `calc(100% / 3 - ${theme.spacing(1)}px)`
      case 'one_fourth':
        return `calc(100% / 2 - ${theme.spacing(1)}px)`
      case 'small':
      default:
        return '60px'
    }
  }

  handleTemp = (index, row) => event => {
    const { settings } = this.props.database
    const value = Number(event.target.value)
    const name = event.target.name
    if (name === 'general' || name === 'basicSafety') {
      settings[name][index].value = value
    } else if (name === 'kba') {
      settings[name][index][row] = value
    } else {
      settings[name][index].values[index] = value
    }
  }

  handleInput = kbaname => event => {

    const { settings } = this.props.database
    const kbaSettings = settings.kba.filter(k => k.name === kbaname)

    if (kbaSettings.length > 0) {
      const value = event.target.value
      const name = event.target.name
      kbaSettings[0][name] = value
      this.props.dispatch({ type: actions.SET_KBA_SETTINGS, settings })

      if (name === '') {
        //this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: 'name', value: value }))
      }
    }
  }

  renderBlockContent = (block, currentState, measure) => {
    const { area, application, classes, database, dialogs, grouplayers, t, theme } = this.props
    let f = null
    if (currentState && dialogs.type === 'section') {
      let status = ''
      if (block.content === 'Beheerdersoordeel') {
        status = `${currentState.name}, Faalkans:`
      } else if (block.content === 'Maatregel') {
        status = `${measure.name}, Faalkans:`
      }
      f = roundFailure(currentState.failureprobability, 3)
      if (f >= 0 && f < 0.1) {
        f = `${block.content}: ${status} niet significant`
      } else if (f >= 0.1 && f < 1) {
        f = `${block.content}: ${status} ${roundFailure(currentState.failureprobability, 1)}%`
      } else if (f >= 1) {
        f = `${block.content}: ${status} ${roundFailure(currentState.failureprobability, 0)}%`
      } else {
        f = `${block.content}: ${status} niet berekend`
      }
    }
    switch (block.content) {
      // TODO
      case 'general':
        return (
          <React.Fragment>
            {this.renderSubTitle(block.content, 'left')}
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                {currentState.map((state, index) => (
                  <Typography key={index} variant="body2" style={{ marginRight: theme.spacing(2) }}>{t(state.name)}</Typography>
                ))}
              </div>
              <form style={{ display: 'flex', flexDirection: 'column' }} autoComplete="off">
                {currentState.map((state, index) => (
                  <TextField
                    key={index}
                    defaultValue={state.value}
                    name={block.content}
                    onChange={this.handleTemp(index)}
                    InputProps={{ className: classes.input }}
                    type="number"
                  />
                ))}
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                {currentState.map((state, index) => (
                  <Typography key={index} variant="body2" style={{ marginLeft: theme.spacing(2) }}>{state.unit}</Typography>
                ))}
              </div>
            </div>
          </React.Fragment>
        )
      case 'kba':
        return (
          <React.Fragment>
            {this.renderSubTitle(block.content, 'left')}
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHead}></TableCell>
                  {currentState.map((state, index) => (
                    <TableCell className={classes.tableHead} key={index}>{t(state.name)}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentState.map((state, index) => {
                  let temp = []
                  let unit = null
                  if (Object.keys(state)[index]) {
                    temp.push(Object.keys(state)[index])
                    if (Object.keys(state)[index] === 'costs') {
                      unit = '(in euro)'
                    } else if (Object.keys(state)[index] === 'executiontime') {
                      unit = '(in uren)'
                    }
                  }
                  const filtered = temp.filter(e => e !== 'name')
                  {
                    return filtered.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.tableCell}>{`${t(row)} ${t(unit)}`}</TableCell>
                        {currentState.map((state, index) => (
                          <TableCell key={index} className={classes.tableCell}>
                            <TextField
                              defaultValue={state[row]}
                              name={block.content}
                              onChange={this.handleTemp(index, row)}
                              variant='outlined'
                              type='number'
                              InputProps={{ className: 'textFieldOutlined' }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  }
                })}
              </TableBody>
            </Table>
          </React.Fragment>
        )
      case 'basicSafety':
        return (
          <React.Fragment>
            {this.renderSubTitle(block.content, 'left')}
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHead}>{t('van')}</TableCell>
                  <TableCell className={classes.tableHead}>{t('naar')}</TableCell>
                  <TableCell className={classes.tableHead}>{t('waarde')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentState.filter(e => e.to !== null).map((state, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}><span style={{ display: 'inline-block', height: 10, width: 10, marginRight: theme.spacing(1), background: state.color }} />{state.from}</TableCell>
                    <TableCell className={classes.tableCell}><span style={{ display: 'inline-block', height: 10, width: 10, marginRight: theme.spacing(1), background: currentState.find(e => e.from === state.to).color, border: '1px solid rgba(224, 224, 224, 1)' }} />{state.to}</TableCell>
                    <TableCell>
                      <TextField
                        defaultValue={state.value}
                        name={block.content}
                        onChange={this.handleTemp(index)}
                        variant='outlined'
                        type='number'
                        InputProps={{ className: 'textFieldOutlined' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </React.Fragment>
        )

      case 'Faalkans':
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {block.svg.show &&
              <div>
                <WarningIcon
                  className={`dialog-icon-${block.svg.size} ${block.svg.border && 'dialog-icon-border'}`}
                  style={{ color: currentState.color }}
                />
              </div>
            }
            <div style={{ width: this.switchBlockSize(block.width), alignSelf: 'center' }}>
              <Typography variant="h5" color="primary" gutterBottom>{f}</Typography>
              <Typography variant="h5" color="primary">{`Status: ${currentState.description}`}</Typography>
            </div>
          </div>
        )
      case 'Faalkans berekend':
      case 'Beheerdersoordeel':
      case 'Maatregel':
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {block.svg.show &&
              <div style={{ marginRight: theme.spacing(1) }}>
                <WarningIcon
                  className={`dialog-icon-${block.svg.size} ${block.svg.border && 'dialog-icon-border'}`}
                  style={{ color: currentState ? currentState.color : '#000000' }}
                />
              </div>
            }
            <div style={{ width: this.switchBlockSize(block.width), alignSelf: 'center' }}>
              <Typography variant="h5">{f}</Typography>
            </div>
          </div>
        )
      case 'Actuele waterstand':
        return (
          <div>
            <Typography variant="h5" color="primary">{`Actuele ${currentState.parametername}:`}</Typography>
            <Typography variant="h5" className='dialog-text-large'>{currentState.waterlevel.toFixed(2)}</Typography>
            <Typography variant="h5" color="primary">[{currentState.parameterunit}]</Typography>
          </div>
        )
      case 'Maximale waterstand':
        return (
          <div>
            <Typography variant="h5" color="primary">{`Maximale ${currentState.parametername} in de komende 48 uur:`}</Typography>
            {this.switchIcon(database.station.measuringstation.conditionfeature, currentState.color, block)}
          </div>
        )
      case 'Status waterstand':
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center' }}>
            {block.svg.show &&
              <div>
                <WarningIcon
                  className={`dialog-icon-${block.svg.size} ${block.svg.border && 'dialog-icon-border'}`}
                  style={{ color: currentState.color }}
                />
              </div>
            }
            <div style={{ alignSelf: 'center' }}>
              {this.renderDescription(application.config.stationOptions, currentState.parametername, currentState.description)}
            </div>
          </div>
        )
      case 'Getroffenen':
        const areaLabel = grouplayers.items.find(item => item.key === area.risico).name
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {block.svg.show &&
              <div>
                <WarningIcon
                  className={`dialog-icon-${block.svg.size} ${block.svg.border && 'dialog-icon-border'}`}
                  style={{ color: currentState.color }}
                />
              </div>
            }
            <div style={{ width: this.switchBlockSize(block.width), alignSelf: 'center' }}>
              <Typography variant="h5" color="primary" style={{ display: 'inline' }}>{areaLabel}</Typography>
              <Typography variant="h5" color="primary" style={{ fontWeight: '500', display: 'inline', marginLeft: 8 }}>{currentState.state}</Typography>
              <Typography variant="h5" color="primary">{currentState.description}</Typography>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  renderBlocks = (view, type) => {
    const { area, classes, database, moment } = this.props
    let currentState = null
    if (type === 'section') {
      if (!database.section.state) return null
      currentState = database.section.state
    } else if (type === 'station') {
      if (!database.station.states) return null
      currentState = database.station.states[moment.index]
    } else if (type === 'area') {
      if (!database.area.areariskdata) return null
      currentState = database.area.areariskdata.find(e => e.parameter.code === area.risico).state
    }
    return view.blocks.map((block, index) => {
      if (block.content === 'Faalkans berekend') {
        currentState = database.section.statebydefault
      } else if (block.content === 'Beheerdersoordeel') {
        currentState = database.section.statebyexpert
      } else if (block.content === 'Maatregel') {
        currentState = database.section.statebymeasure
      } else if (block.content === 'kba' || block.content === 'basicSafety') {
        currentState = database.settings[block.content]
      } else if (block.content === 'general') {
        currentState = database.settings[block.content].filter(e => e.name === 'victimvalue')
      }
      if (!currentState) return null
      return (
        <div key={index} className={classes.block} style={{ flexGrow: view.flex === 'column' && block.height !== 'small' ? 1 : 0, width: this.switchBlockSize(block.width), textAlign: block.align }}>
          {this.renderBlockContent(block, currentState, database.section.measure)}
        </div>
      )
    })
  }

  createMarkup = (text) => {
    return { __html: text }
  }

  renderModalBlocks = (view, modalIndex) => {
    const { classes } = this.props
    return view.blocks.map((block, index) => (
      <div key={index} className={classes.block} style={{ flexGrow: view.flex === 'column' && block.height !== 'small' ? 1 : 0, width: this.switchBlockSize(block.width), textAlign: block.align }}>
        {this.renderModalBlockContent(block, modalIndex)}
      </div>
    ))
  }

  renderModalContent = (modal) => {
    const { classes, database, dialogs } = this.props
    return modal.views.map((view, index) => {
      switch (view.type) {
        case 'blocks':
          return (
            // <React.Fragment key={index}>
            // {this.renderSubTitle(view.subtitle)}
            <div key={index} className={`swipeableview-slide ${database.dialogLoading && classes.hidden}`} style={{ flexDirection: view.flex, flexWrap: view.wrap && 'wrap', overflowY: view.scroll === false && 'hidden' }}>
              {this.renderModalBlocks(view, index)}
            </div>
            // </React.Fragment>
          )
        case 'table':
          return (
            <div key={index} className={`swipeableview-slide swipeableview-table ${database.dialogLoading && classes.hidden}`}>
              {this.renderTable(dialogs.type)}
            </div>
          )
      }
    })
  }

  renderSubTitle = (subtitle, align) => {
    const { t } = this.props
    // return <span><b>{subtitle}</b></span>
    return <Typography variant="h5" gutterBottom align={align}>{t(subtitle)}</Typography>
  }

  renderDialogContent = (dialog) => {
    const { application, classes, database, dialogs, theme, uncertainty } = this.props
    if (!dialogs.type) return <p>geen data</p>
    let vegaSpec = null
    //const dialog = application.config.dialogs.find(dialog => dialog.key === dialogs.type)
    // this.setState({dialog: dialog})

    // TODO
    // - values van selects
    return dialog.views.map((view, index) => {
      switch (view.type) {
        case 'blocks':
          return (
            <div key={index} className={`swipeableview-slide ${database.dialogLoading && classes.hidden}`} style={{ flexDirection: view.flex, flexWrap: view.wrap && 'wrap', overflowY: view.scroll === false && 'hidden' }}>
              {this.renderBlocks(view, dialogs.type)}
            </div>
          )
        case 'vega':
          vegaSpec = application.config.vega.find(spec => spec.key === dialogs.type)
          // alleen uitvoeren wanneer dialog open is en wanneer er een vega spec in redux staat (deze wordt geleegd wanneer je een dialog sluit)
          if (dialogs.state && !this.props.vega.specs) {
            this.props.dispatch(asyncActions.getVegaSpecification(this.props.url, vegaSpec.specName))
              .then(spec => {
                vegaSpec.json = spec.specification
              })
          }
          return (
            <div key={index} className={`swipeableview-slide ${database.dialogLoading && classes.hidden}`} style={{ flexDirection: view.flex, flexWrap: view.wrap && 'wrap', overflowY: view.scroll === false && 'hidden' }}>
              {vegaSpec.json &&
                <React.Fragment>
                  <HKVVega
                    application={application}
                    setView={this.setView}
                    specs={vegaSpec.json}
                    options={view.options}
                    id={view.options.key}
                  />
                  <ResizeObserver
                    onResize={(rect) => { this.handleResize(rect.width, rect.height, vegaSpec, view.options.key) }}
                  />
                </React.Fragment>
              }
            </div>
          )
        case 'table':
          return (
            <div key={index} className={`swipeableview-slide swipeableview-table ${database.dialogLoading && classes.hidden}`}>
              {this.renderTable(dialogs.type)}
            </div>
          )
        case 'single-select':
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <Typography variant="body1">{view.actions.description}</Typography>
              <form autoComplete="off" style={{ marginTop: theme.spacing(1) }}>
                <FormControl>
                  <InputLabel>{view.actions.name}</InputLabel>
                  <Select
                    disabled={view.actions.disabled}
                    value={uncertainty.name}
                    onChange={this.setEnsemble}
                  >
                    {view.actions.options.map((option, index) => (
                      <MenuItem key={index} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </form>
            </div>
          )
        case 'leaflet':
          return (
            <div key={index} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div className={`${classes.oneHalf} dialog-map-wrapper`}>
                <HKVMap
                  setMap={this.setMap}
                  application={{ ...application }}
                />
              </div>
              <div className={classes.oneHalf}>
                {this.renderTable(dialogs.type)}
              </div>
            </div>
          )
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

  toggleSubscription = (token) => {
    return null
  }

  openWaterlevelRemotes = () => {
    this.props.dispatch({ type: actions.WATERLEVEL_REMOTES_STATE, open: true })
  }

  closeWaterlevelRemotes = () => {
    this.props.dispatch({ type: actions.WATERLEVEL_REMOTES_STATE, open: false })
  }

  switchLocationIcon = () => {
    const { classes, waterlevel } = this.props
    switch (waterlevel.remote) {
      case true:
        return (
          <Fab
            id="waterlevelRemote"
            className={`${classes.button} ${classes.locations}`}
            color="primary"
            onClick={this.closeWaterlevelRemotes}
            style={{ display: waterlevel.open ? 'inline-flex' : 'none' }}
          >
            <LocationOffIcon />
          </Fab>
        )
      case false: default:
        return (
          <Fab
            id="waterlevelRemote"
            className={`${classes.button} ${classes.locations}`}
            color="primary"
            onClick={this.openWaterlevelRemotes}
            style={{ display: waterlevel.open ? 'inline-flex' : 'none' }}
          >
            <LocationIcon />
          </Fab>
        )
    }
  }

  selectStart = (menuItem) => {
    if (process.env.apptype !== menuItem.apptype) {
      process.env.apptype = menuItem.apptype
      this.props.dispatch(asyncActions.getSimulation(process.env.webserver, this.props.appid))
        .then(() => {
          this.props.dispatch(asyncActions.setApplicationDetailConfig(this.props.url)).then((application) => {
            if (process.env.type === 'app') {
              application.config = JSON.parse(application.statusText).application[0]
            }
            this.props.dispatch(asyncActions.getConditions(process.env.webserver, application.config.id, 'section'))

            if (application.config.openDrawers) {
              application.config.openDrawers.map(drawer => {
                const type = `DRAWER_${drawer.toUpperCase()}_STATE`
                this.props.dispatch({ type: actions[type], open: window.innerWidth <= 600 ? false : true })
              })

              this.props.dispatch(asyncActions.getAppInfo(process.env.webserver, 'ci', application.config.id, 2))
            }

            this.props.dispatch({ type: actions.SET_ACTIVE_VIEW, active: 'waterkeringen' })

            // ophalen KBA settings
            this.props.dispatch(asyncActions.getSettings(process.env.webserver, application.config.id))

            if (application.config.startMenuActive === true) {
            } else if (application.config.startMenu.active === false) {
              this.props.dispatch({ type: actions.START_DIALOG_STATE, open: false })
            }

            this.props.dispatch({ type: actions.SET_MENU_INDEX, index: 0 })
          })
        })
    }

    this.props.dispatch({ type: actions.START_DIALOG_STATE, open: false })
    if (menuItem.label === 'What-if inzicht' && process.env.type !== 'app') {
      this.props.dispatch({ type: actions.DRAWER_SCENARIO_STATE, open: true })
    }
    this.props.dispatch({ type: actions.SET_MENU_INDEX, index: menuItem.index })
    this.props.dispatch({ type: actions.SET_MENU_LABEL, label: menuItem.label })
  }

  handleApply = (parameters, fromDate, toDate) => {
    const { appid, database } = this.props
    this.setState({ parameters: parameters })
    this.props.dispatch(asyncActions.setSimulation(process.env.webserver, appid, parameters, fromDate, toDate, database.simulation.speeds[0].id))
  }

  handleSpeed = (speed) => {
    const { appid, database } = this.props
    const allowed = ['d', 'k', 'q', 'timedep', 'u', 'zp']
    const filtered = Object.keys(database.simulation)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = database.simulation[key]
        return obj
      }, {})
    this.props.dispatch(asyncActions.setSimulation(process.env.webserver, appid, filtered, database.simulation.starttime, database.simulation.endtime, speed))
      .then(() => this.props.dispatch(asyncActions.setSimulationActive(process.env.webserver, appid, true)))
  }

  handleDialogTitleChange = (e) => {
    const value = e.target.value
    const action = e.target.name
    const { viewObject } = this.state
    switch (action.type) {
      case 'moment':
        this.onMomentChange(value)
        break
      case 'signal':
        this.props.dispatch(asyncActions.sendSignal(viewObject, { signalName: action.name, value: value }))
        break
      case 'overlay':
        this.areaOverlayLayerChange(e)
        break
    }
  }

  exportToCSV = (key) => {
    const type = this.props.database[key]
    exportJsonToCSV(type, `export_${type}.csv`)
  }

  render() {
    const { appid, application, area, classes, database, dialogs, moment } = this.props
    const { disabled, mapKey } = this.state

    if (!database.appinfo.name) {
      return (<StartMenu onClick={this.selectStart} />)
    }

    if (!application) return null
    let icon = `/static/images/${application.config.schema}/favicon.ico`
    if (process.env.type === 'app') {
      icon = `./static/images/${application.config.schema}/favicon.ico`
    }
    let selectedOptions = []
    if (dialogs.type === 'area') {
      selectedOptions = [area.risico]
    } else {
      selectedOptions = [moment.index, 'Combinatie faalmechanismen']
    }

    let dialog = []
    if (application.config.dialogs) {
      dialog = application.config.dialogs.find(dialog => dialog.key === dialogs.type)
    }

    // TODO
    // - scenario dialog in hkv dialog
    // ^ let icon (kijken naar absolute en relatieve urls)
    // ^ if dialog.type voor selectedOptions
    return (
      <React.Fragment>
        <Head>
          <title>{application.config.name}</title>
          {icon && <link rel="shortcut icon" type="image/x-icon" href={icon} />}
        </Head>
        <MapLayout>
          {database.simulation && database.simulation.calculating &&
            <div className={classes.blockScreen}>
              <CircularProgress style={{ color: 'white' }} thickness={4} size={60} />
            </div>
          }
          {database.loading && <LinearProgress style={{ top: 0 }} className={classes.progress} />}
          <Fab
            className={classes.button}
            color="primary"
            onClick={() => this.toggleDrawer('left')}
          >
            <ChevronRightIcon />
          </Fab>
          {application.config.stationOptions && application.config.stationOptions.remoteLayers &&
            <React.Fragment>
              {this.switchLocationIcon()}
              <WaterlevelRemote
                onClick={this.onClickLayer}
              />
            </React.Fragment>
          }
          <Fab
            className={classes.button}
            color="primary"
            onClick={() => this.toggleDrawer('right')}
          >
            <ChevronLeftIcon />
          </Fab>
          {application.config.startMenuActive && <StartMenu onClick={this.selectStart} />}
          <HKVMap
            setMap={this.setMap}
            application={application}
            onload={this.leafletControls(application)}
          />
          <EmbankmentStatus />
          <MomentStepper
            onMomentChange={this.onMomentChange}
          />
          <DrawerLeft
            onClose={() => this.toggleDrawer('left')}
            onItemClick={this.onItemClick}
            url={window.location.pathname}
          />
          {/* Scenario drawer/dialog alleen inladen wanneer er een scenario is */}
          {this.props.menu.label === 'What-if inzicht'
            || this.props.menu.label === 'Beslissen onder onzekerheid'
            ? <React.Fragment>
              <DrawerScenario
                appid={appid}
                mapObject={this.mapObject[mapKey]}
                onApply={this.getAppInfo}
                onChange={this.handleSpeed}
                onChangeFeatures={this.refreshMap}
                onClick={this.onItemClick}
                onClose={this.closeDialog}
                onMomentChange={this.onMomentChange}
              />
              {appid === 19 || appid === 20
                ? <ScenarioDialogGrave
                  appid={appid}
                  onApply={this.handleApply}
                  onClose={this.closeDialog}
                  onExport={this.exportToCSV}
                  onMouseOut={this.onMouseOut}
                  onMouseOver={this.onMouseOver}
                  onResize={this.handleResize}
                  setView={this.setView}
                  setContourView={this.setContourView}
                  viewObject={this.state.viewObject}
                  contourViewObject={this.state.contourViewObject}
                  url={this.props.url}
                />
                : <ScenarioDialog
                  appid={appid}
                  onApply={this.handleApply}
                  onClose={this.closeDialog}
                  onExport={this.exportToCSV}
                  onMouseOut={this.onMouseOut}
                  onMouseOver={this.onMouseOver}
                  onResize={this.handleResize}
                  setView={this.setView}
                  setContourView={this.setContourView}
                  viewObject={this.state.viewObject}
                  contourViewObject={this.state.contourViewObject}
                  url={this.props.url}
                />
              }
            </React.Fragment>
            : null
          }
          <HkvDialog
            dialog={dialog}
            disabled={disabled}
            handleClick={this.handleClick}
            renderDialogContent={this.renderDialogContent}
            renderModalContent={this.renderModalContent}
            handleDialogTitleChange={this.handleDialogTitleChange}
            onConditionChange={this.onConditionChange}
            selectedOptions={selectedOptions}
          />
          <DrawerRight
            onClose={() => this.toggleDrawer('right')}
            onOverlayLayerChange={this.onOverlayLayerChange}
            onBaseLayerChange={this.onBaseLayerChange}
            showLegend={appid === 1}
            title={'Kaartlagen'}
            basetitle={'Achtergrond'}
          />
        </MapLayout>
      </React.Fragment>
    )
  }
}

ContinuInzicht.propTypes = {
  t: PropTypes.func.isRequired,
}

ContinuInzicht = withNamespaces('mangrove')(ContinuInzicht)
ContinuInzicht = withStyles(styles, { withTheme: true })(ContinuInzicht)
export default connect(state => state)(ContinuInzicht)
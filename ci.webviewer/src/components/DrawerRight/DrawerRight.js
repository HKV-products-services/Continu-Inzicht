import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import * as actions from '../../state/actions'
const { SET_ACTIVE_VIEW, SET_AREA_RISK } = actions

import Checkbox from '@material-ui/core/Checkbox'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuHeader from '../MenuHeader'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  drawerPaper: {
    background: '#f5f5f5',
    boxShadow: '1px 0px 10px rgba(0,0,0,0.3)',
    [theme.breakpoints.up('xs')]: {
      width: '95%'
    },
    [theme.breakpoints.up('sm')]: {
      width: 360
    }
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: `0 ${theme.spacing(1)}px`,
    ...theme.mixins.toolbar
  },
  drawerHeaderTitle: {
    alignItems: 'center',
    padding: `0 ${theme.spacing(1)}px`
  },
  expansionPanel: {
    '&:first-child': {
      borderRadius: 0
    },
    '&:last-child': {
      borderRadius: 0
    }
  },
  ExpansionPanelDetails: {
    flexDirection: 'column'
  },
  formControl: {
    margin: theme.spacing(1),
    width: `calc(100% - ${theme.spacing(2)}px)`
  },
  group: {
    margin: `${theme.spacing(1)}px 0`
  },
  formLabel: {
    padding: '0 8px',
  },
  button: {
    margin: `${theme.spacing(1)}px 0`
  },
  circle: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  hidden: {
    transform: 'translateX(600px) !important'
  },
  select: {
    padding: theme.spacing(1),
    marginRight: theme.spacing(0.5)
  },
  formControlLabel: {
    marginRight: 0,
    // marginBottom: theme.spacing(1)
  },
  radioLabel: {
    // textAlign: 'right',
    fontSize: theme.typography.pxToRem(14),
    color: '#2196f3'
  },
  radioGroup: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    padding: `${theme.spacing(0.5)}px 0`
  }
})

class DrawerRight extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      baselayer: ''
    }
  }

  componentDidMount = () => {
    const { application } = this.props
    application.config.map.baselayers.forEach(baselayer => {
      if (baselayer.active) {
        this.setState({
          baselayer: baselayer.key
        })
      }
    })
  }

  onOverlayLayerChange = grouplayer => event => {
    const { views } = this.props.database.appinfo
    const active = event.target.checked
    views.forEach(view => {
      if (view !== "gebieden") {
        this.props.onOverlayLayerChange(grouplayer, active)
      }
    })
  }

  onBaseLayerChange = event => {
    const { application } = this.props
    application.config.map.baselayers.forEach(baselayer => {
      const active = baselayer.key === event.target.value
      this.props.onBaseLayerChange(baselayer, active)
      if (active) {
        this.setState({ baselayer: baselayer.key })
      }
    })
  }

  onViewChange = view => (event, expanded) => {
    const { area, grouplayers } = this.props

    if (view.key === 'gebieden') {
      grouplayers.items.forEach(grouplayer => {
        if (grouplayer.view !== 'custom') {
          this.props.onOverlayLayerChange(grouplayer, false)
        }
      })
      const radioLayers = grouplayers.items.filter(layer => layer.view === view.key && layer.selection === 'radio')
      radioLayers.forEach(radioLayer => {
        this.props.onOverlayLayerChange(radioLayer, radioLayer.key === area.risico)
      })
    } else if (view.key === 'hhnk' || view.key === 'hhnkwms' || view.key === 'locaties' || view.key === 'baseviewer' || view.key === 'custom') {
      grouplayers.items.filter(grouplayer => grouplayer.active === false).forEach(grouplayer => {
        this.props.onOverlayLayerChange(grouplayer, false)

      })
    } else {
      grouplayers.items.forEach(grouplayer => {
        if (grouplayer.view !== 'custom') {
          this.props.onOverlayLayerChange(grouplayer, grouplayer.view === view.key)
        }
      })
    }
    this.props.dispatch({ type: SET_ACTIVE_VIEW, active: view.key })
  }

  renderActions = () => {
    const { classes, actionbuttons, onActionClick } = this.props
    if (!actionbuttons) return null
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          <ExpansionPanel
            className={classes.expansionPanel}
            expanded={true}
          >
            <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
              <Typography className={classes.heading}>{this.props.actions}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
              {actionbuttons.map((actionbutton, index) => (
                <Button
                  key={index}
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  onClick={() => onActionClick(actionbutton)}
                >
                  {actionbutton.label}
                </Button>
              ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </FormGroup>
      </FormControl>
    )
  }

  renderKaartlagen = () => {
    const { area, database, grouplayers, moment, type, uncertainty, views } = this.props
    const { classes } = this.props
    if (!grouplayers.items) return null

    // TODO
    let overlays = null
    if (type === 'Type beheer') {
      overlays = grouplayers
    } else {
      overlays = { items: grouplayers.items.filter(layer => layer.key != 'beheer') }
    }

    let onViewChange = this.onViewChange
    if (this.props.onViewChange) {
      onViewChange = this.props.onViewChange
    }
    return (database.appinfo.views &&
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {database.appinfo.views.map(view => (
            <ExpansionPanel
              key={view.key}
              className={classes.expansionPanel}
              expanded={views.active === view.key}
              onChange={onViewChange(view)}
            >
              <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
                <Typography className={classes.heading}>{view.label}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
                {overlays.items.filter(layer => layer.view === view.key && layer.selection === "check").map(grouplayer => (
                  <FormControlLabel
                    disabled={grouplayer.disabled}
                    className={classes.formControlLabel}
                    key={grouplayer.key}
                    control={this.renderCheckbox(grouplayer)}
                    label={grouplayer.name}
                  />
                ))}
                {overlays.items.filter(layer => layer.view === view.key && layer.selection === "radio").map((grouplayer, index) => {
                  let riskVal =
                    database.appinfo.moments &&
                    database.appinfo.moments[moment.index].risks &&
                    database.appinfo.moments[moment.index].risks.filter(risk => risk.ensembleid === uncertainty.id).find(e => e.parametercode === grouplayer.key)
                  let value = 0
                  if (riskVal && riskVal.unit === '%') {
                    value = (riskVal.value * 100).toFixed(0)
                  } else if (riskVal) {
                    value = riskVal.value.toFixed(2)
                  }
                  return (
                    <RadioGroup
                      key={index}
                      value={area.risico}
                      onChange={this.handleRisicoChange}
                      className={classes.radioGroup}
                    >
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={this.renderRadioBox(grouplayer, area.risico === grouplayer.key)}
                        label={grouplayer.name}
                      />
                      {riskVal && <Typography className={classes.radioLabel}>{`${value} ${riskVal.unit}`}</Typography>}
                    </RadioGroup>
                  )
                })}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </FormGroup>
      </FormControl>
    )
  }

  renderBaseLayers(title) {
    const { application, classes } = this.props
    const { baselayer } = this.state
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <ExpansionPanel className={classes.expansionPanel}>
          <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
            <FormLabel focused={false} component="legend">{title}</FormLabel>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RadioGroup
              aria-label={title}
              name={title}
              className={classes.group}
              value={baselayer}
              onChange={this.onBaseLayerChange}
            >
              {application.config.map.baselayers.map((layer, index) =>
                <FormControlLabel
                  className={classes.formControlLabel}
                  key={`${layer.key}-${index}`}
                  value={layer.key}
                  control={this.renderRadioBox(layer, baselayer === layer.key)}
                  label={layer.name}
                />
              )}
            </RadioGroup>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </FormControl>
    )
  }

  renderRadioBox(layer, checked) {
    const { classes } = this.props
    return <Radio
      checked={checked}
      className={classes.select}
      color="primary"
      disableRipple
      value={layer.key}
    />
  }

  handleRisicoChange = event => {
    const { grouplayers } = this.props
    this.props.dispatch({
      type: SET_AREA_RISK,
      risk: event.target.value
    })
    grouplayers.items.forEach(grouplayer => {
      if (grouplayer.view !== 'custom') {
        this.props.onOverlayLayerChange(grouplayer, false)
      }
    })
    const radioLayers = grouplayers.items.filter(layer => layer.view === "gebieden" && layer.selection === "radio")
    radioLayers.forEach(radioLayer => {
      this.props.onOverlayLayerChange(radioLayer, radioLayer.key === event.target.value)
    })
  }

  renderCheckbox(layer) {
    const { classes } = this.props
    return <Checkbox
      checked={layer.active}
      className={classes.select}
      color="primary"
      disableRipple
      onChange={this.onOverlayLayerChange(layer)}
      value={layer.name}
    />
  }

  handleFunctionChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.props.changeActiveFunction(name, value)
  }

  renderFunctions = () => {
    const { application, classes } = this.props
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          <ExpansionPanel
            className={classes.expansionPanel}
            defaultExpanded
            // onChange={onViewChange(view)}
          >
            <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
              <Typography className={classes.heading}>Functies</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
              {application.config.map.functions.map((grouplayer, index) => (
                <RadioGroup
                  key={index}
                  value={grouplayer.key}
                  name={grouplayer.name.toLowerCase()}
                  onChange={this.handleFunctionChange}
                  className={classes.radioGroup}
                >
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={this.renderRadioBox(grouplayer, grouplayer.key === this.props.activeFunction.key)}
                    label={grouplayer.name}
                  />
                </RadioGroup>
              ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </FormGroup>
      </FormControl>
    )
  }

  render() {
    const { application, classes, drawers, onClose, title, basetitle, renderLegend, actions, showLegend } = this.props
    const tooltip = 'mangrove.webviewer'

    let renderLegendFunction = renderLegend
    if (!renderLegend && showLegend){
      renderLegendFunction = this.renderLegend
    }

    return (
      <Drawer
        anchor='right'
        variant='persistent'
        classes={drawers.right ? { paper: classes.drawerPaper } : { paper: `${classes.drawerPaper} ${classes.hidden}` }}
        open={drawers.right}
      >
        <MenuHeader
          onClick={() => onClose()}
          tooltip={tooltip}
          titleText={title}
          type={'right'}
          icon={<ChevronRightIcon />}
        />
        {this.renderKaartlagen()}
        {application.config.map.functions && this.renderFunctions()}
        {this.renderBaseLayers(basetitle)}
        {renderLegendFunction && renderLegendFunction()}
        {actions && this.renderActions()}
      </Drawer>
    )
  }

  renderLegend = () => {
    const { classes } = this.props
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <ExpansionPanel className={classes.expansionPanel}>
          <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
            <FormLabel focused={false} component="legend">Legend</FormLabel>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
            {this.renderWmsLegend()}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </FormControl>
    )
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
}

DrawerRight = withStyles(styles, { withTheme: true })(DrawerRight)
export default connect(state => state)(DrawerRight)
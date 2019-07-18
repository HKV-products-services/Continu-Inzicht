import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import * as actions from '../../../state/actions'
const { SET_ACTIVE_VIEW, SET_AREA_RISK } = actions

import Checkbox from '@material-ui/core/Checkbox'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Drawer from '@material-ui/core/Drawer'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'

import MenuHeader from '../../MenuHeader'

const styles = theme => ({
  heading: {
    fontSize: theme
      .typography
      .pxToRem(15),
    fontWeight: theme.typography.fontWeightBold
  },
  drawerPaper: {
    background: '#f5f5f5',
    boxShadow: '1px 0px 10px rgba(0,0,0,0.3)',
    [theme.breakpoints.up('xs')]: {
      width: '100%'
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
    padding: `${theme.spacing(1) + theme.spacing(0.5)}px ${theme.spacing(1) + theme.spacing(0.5)}px`
  }
})

class LayerControl extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...props,
      baselayer: null
    }
  }

  componentDidMount = () =>{
    const { application } = this.props
    application.config.map.baselayers.forEach(baselayer => {
      if(baselayer.active) {
        this.setState({baselayer: baselayer.key})
      }
    })
  }

  onOverlayLayerChange = (event, layer) => {
    const { views } = this.props.database.appinfo
    const active = event.target.checked
    views.forEach(view => {
      this.props.onOverlayLayerChange(layer, active)
    })
  }

  onBaseLayerChange = event => {
    const { application } = this.props
    application.config.map.baselayers.forEach(baselayer => {
      const active = baselayer.key === event.target.value
      this.props.onBaseLayerChange(baselayer, active)
      if (active) {
        this.setState({baselayer: baselayer.key})
      }
    })
  }

  onViewChange = view => (event, expanded) => {
    const { area, grouplayers } = this.props
    if (view.key=== 'gebieden') {
      grouplayers.items.forEach(grouplayer => {
        this.props.onOverlayLayerChange(grouplayer, false)
      })
      const radioLayers = grouplayers.items.filter(layer => layer.view === view.key && layer.selection === 'radio')
      radioLayers.forEach(radioLayer => {
        this.props.onOverlayLayerChange(radioLayer, radioLayer.key === area.risico)
      })
    } else if (view.key === 'hhnk' || view.key === 'hhnkwms' || view.key === 'locaties') {
      grouplayers.items.filter(grouplayer => grouplayer.active === false).forEach(grouplayer => {
        this.props.onOverlayLayerChange(grouplayer, false)
      })
    } else {
      grouplayers.items.forEach(grouplayer => {
        this.props.onOverlayLayerChange(grouplayer, grouplayer.view === view.key)
      })
    }
    this.props.dispatch({type: SET_ACTIVE_VIEW, active: view.key})
  }

  renderKaartlagen = () => {
    const { area, database, grouplayers } = this.props
    const { classes } = this.state
    if (!grouplayers.items) return null
    let onViewChange = this.onViewChange
    if (this.props.onViewChange){
      onViewChange = this.props.onViewChange
    }
    return (database.appinfo.views &&
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {database.appinfo.views.map(view => (
            <ExpansionPanel
              key={view.key}
              className={classes.expansionPanel}
              expanded={view.expanded}
              onChange={() => onViewChange(view)}
            >
              <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
                <Typography className={classes.heading}>{view.label}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
                  {
                    grouplayers.items.filter(layer => layer.view === view.key && layer.selection === "check").map(grouplayer => (
                    <FormControlLabel
                      key={grouplayer.key}
                      control={this.renderCheckbox(grouplayer)}
                      label={grouplayer.name}
                    />
                  ))}
                  {grouplayers.items.filter(layer => layer.view === view.key && layer.selection === "radio").map(grouplayer => (
                    <RadioGroup
                      key={grouplayer.key}
                      aria-label="risico"
                      name="Risico"
                      value={area.risico}
                      onChange={this.renderRadioGroup(grouplayer)}
                    >
                      <FormControlLabel
                        control={this.renderRadioBox(grouplayer, area.risico === grouplayer.key)}
                        label={grouplayer.name}
                      />
                    </RadioGroup>
                  ))}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </FormGroup>
      </FormControl>
    )
  }

  renderBaseLayers(title) {
    const { application } = this.props
    const { baselayer, classes } = this.state
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <ExpansionPanel defaultExpanded className={classes.expansionPanel}>
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

  renderRadioGroup = event => {
    const { grouplayers } = this.props

    const radioLayers = grouplayers.items.filter(layer => layer.selection === "radio")
    radioLayers.forEach(radioLayer => {
      this.props.onOverlayLayerChange(radioLayer, radioLayer.key === event.target.value)
    })
  }

  renderCheckbox(layer) {
    const { classes } = this.props
    let onOverlayLayerChange = this.onOverlayLayerChange
    if (this.props.onOverlayLayerChange){
      onOverlayLayerChange = this.props.onOverlayLayerChange
    }
    // if there is a groupkey
    let key = layer.groupkey ? layer.groupkey : layer.key
    return <Checkbox
      checked={layer.active}
      className={classes.select}
      color="primary"
      disableRipple
      onChange={(event) => onOverlayLayerChange(event, layer)}
      value={key}
    />
  }

  render() {
    const { classes, drawers, onClose, title, basetitle, renderLegend } = this.props
    return (
      <Drawer
        anchor='right'
        variant='persistent'
        classes={drawers.right ? {paper: classes.drawerPaper}  : {paper: `${classes.drawerPaper} ${classes.hidden}`}}
        open={drawers.right}
      >
        <MenuHeader
          onClick={() => onClose()}
          titleText={title}
          type={'right'}
          icon={<ChevronRightIcon />}
        />
        {this.renderKaartlagen()}
        {this.renderBaseLayers(basetitle)}
        {renderLegend && renderLegend()}
      </Drawer>
    )
  }
}

LayerControl = withStyles(styles, { withTheme: true })(LayerControl)
export default connect(state => state)(LayerControl)
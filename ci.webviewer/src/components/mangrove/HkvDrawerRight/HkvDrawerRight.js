import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import * as actions from '../../../state/actions'

import Checkbox from '@material-ui/core/Checkbox'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Drawer from '@material-ui/core/Drawer'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuHeader from '../MenuHeader'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper'
import ListIcon from '@material-ui/icons/List';
import DescriptionIcon from '@material-ui/icons/Description';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { i18n, withNamespaces } from '../../../i18n'

const styles = theme => ({
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
  card: {
    flexDirection: 'row'
  },
  formControl: {
    margin: theme.spacing(1),
    width: `calc(100% - ${theme.spacing(2)}px)`
  },
  group: {
    margin: `${theme.spacing(1)}px 0`
  },
  hidden: {
    transform: 'translateX(600px) !important'
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  select: {
    padding: `${theme.spacing(1) + theme.spacing(0.5)}px ${theme.spacing(1) + theme.spacing(0.5)}px`
  },
  layer: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  title: {
    alignSelf: 'center'
  },
  slider: {
    padding: '22px 0px',
  },
  options: {
    display: 'flex',
    margin: theme.spacing(1)
  },
  paper: {
    margin: `${theme.spacing(1)}px 0`
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
})

class HkvDrawerRight extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...props
    }
  }

  componentDidMount = () => {
    const { application } = this.props
    const panels = application.config.map.panels
    if (panels) {
      panels.map(panel => {
        panel.items.map(item => {
          if (item.layers) {
            const activeLayer = item.layers.find(layer => layer.active === true)
            this.setState({
              [item.key]: activeLayer.key
            })
          }
          else if (item.layer) {
            this.setState({
              [item.layer.key]: item.layer.active
            })
          }
        })
      })
    }
  }

  onLayerCheckboxChange = (event, layer) => {
    this.setState({
      [layer.key]: event.target.checked
    })
  }

  onLayerGroupChange = (event, layergroup) => {

    const activeLayer = layergroup.layers.find(layer => layer.key === event.target.value)

    console.log('onLayerGroupChange', activeLayer)
    if (activeLayer) {
      this.setState({
        [layergroup.key]: activeLayer.key
      })
    }

    //if (this.props.onChange) {
    //  this.props.onChange(layergroup,activeLayer)
    //}
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

  handleOpacityChange = (event, value, layer) =>{
    console.log('handleOpacityChange', event, value, layer)  
  }

  renderLayer = (layer) => {
    const { classes } = this.props

    return (
      <Paper key={layer.key} className={classes.paper}>
        <div className={classes.layer}>
          <Checkbox
            checked={layer.active}
            className={classes.select}
            color="primary"
            disableRipple
            onChange={(event) => this.onLayerCheckboxChange(event, layer)}
          />
          <Typography className={classes.title} color="textSecondary">   {layer.name}
          </Typography>
        </div>
        <div className={classes.options}>
        <Tooltip title="Toon metadata" aria-label="Metadata">
          <Slider
            className={classes.slider}
            value={1}
            min={0}
            max={1}
            step={0.1}
            aria-labelledby="opacity"
            onChange={(event, value) => this.handleOpacityChange(event, value, layer)}
          />
          </Tooltip>
          <Tooltip title="Toon metadata" aria-label="Metadata">
            <IconButton aria-label="Metadata">
              <DescriptionIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toon legenda" aria-label="Legend">
            <IconButton aria-label="Legend">
              <ListIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Paper>
    )
  }

  renderItems = (items) => {
    const { classes } = this.props

    return items.map((item, index) => {

      if (item.layers) {
        return (
          <Paper className={classes.paper}>
            <RadioGroup
              key={`item-${index}`}
              aria-label={item.name}
              name={item.name}
              className={classes.group}
              onChange={(event) => this.onLayerGroupChange(event, item)}
              value={this.state[item.key]}
            >
              {
                item.layers.map((layer, index) => (
                  <FormControlLabel
                    key={`${layer.key}-${index}`}
                    value={layer.key}
                    control={this.renderRadioBox(layer, this.state[item.key] === layer.key)}
                    label={layer.name}
                  />
                ))
              }
            </RadioGroup>
          </Paper>
        )
      }
      else {
        return this.renderLayer(item.layer)
      }
    })
  }

  renderPanel = (panel, index) => {
    const { classes } = this.props

    return (
      <FormControl key={`fc_${index}`} component="fieldset" className={classes.formControl}>
        <ExpansionPanel className={classes.expansionPanel}>
          <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
            <FormLabel focused={false} component="legend">{panel.name}</FormLabel>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
            {this.renderItems(panel.items)}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </FormControl>
    )
  }

  renderPanels() {
    const { application, t } = this.props

    const panels = application.config.map.panels
    if (panels) {
      return panels.map((panel, index) => {
        return this.renderPanel(panel, index)
      })
    }
  }

  render() {
    const { classes, drawers, onClose, application, t } = this.props

    if (!application.config.locale) return null

    const title = t('layers')

    return (
      <Drawer
        anchor='right'
        variant='persistent'
        classes={drawers.right ? { paper: classes.drawerPaper } : { paper: `${classes.drawerPaper} ${classes.hidden}` }}
        open={drawers.right}
      >
        <MenuHeader
          onClick={() => onClose()}
          titleText={title}
          type={'right'}
          icon={<ChevronRightIcon />}
        />
        {this.renderPanels()}
      </Drawer>
    )
  }
}
HkvDrawerRight = withNamespaces('mangrove')(HkvDrawerRight)
HkvDrawerRight = withStyles(styles, { withTheme: true })(HkvDrawerRight)
export default connect(state => state)(HkvDrawerRight)
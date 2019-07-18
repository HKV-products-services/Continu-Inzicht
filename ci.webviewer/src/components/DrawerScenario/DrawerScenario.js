import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import asyncActions from '../../state/async-actions'
import * as actions from '../../state/actions'

import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import FastForwardIcon from '@material-ui/icons/FastForward'
import MenuHeader from '../MenuHeader'
import Paper from '@material-ui/core/Paper'
import PauseIcon from '@material-ui/icons/Pause'
import PlayIcon from '@material-ui/icons/PlayArrow'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import StepIcon from '@material-ui/core/StepIcon'
import StepLabel from '@material-ui/core/StepLabel'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import { localDateTime, localDateTimeLong, msToTime } from '../../lib/utils'

import packageJson from '../../../package.json'

const styles = theme => ({
  drawerPaper: {
    background: '#f5f5f5',
    boxShadow: '1px 0px 10px rgba(0,0,0,0.3)',
    [theme.breakpoints.up('xs')]: {
      width: '95%' 
    },
    [theme.breakpoints.up('sm')]: {
      width: 460
    }
  },
  container: {
    maxWidth: 460,
    height: '100%',
  },
  contentOuter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: `0 ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  contentInner: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1),
    padding: theme.spacing(2)
  },
  inline: {
    display: 'inline-block'
  },
  inlineFlex: {
    display: 'inline-flex',
    justifyContent: 'space-between'
  },
  mediaIcon: {
    margin: `0 ${theme.spacing(1)}px`
  },
  button: {
    margin: theme.spacing(2),
    '&:last-of-type': {
      marginRight: 0
    },
    '&:first-of-type': {
      marginLeft: 0
    }
  },
  stepper: {
    padding: 0,
    marginTop: theme.spacing(2),
    opacity: 0.5
  },
  stepButton: {
    margin: 0,
    padding: 0
  },
  stepIconActive: {
    color: '#a6a6a6'
    // color: theme.palette.primary.main
    // stepIconActive op null wanneer handlespeed weer enabled is
  },
  stepLabelActive: {
    color: '#a6a6a6'
    // color: theme.palette.text.primary
  },
  hidden: {
    transform: 'translateX(-600px) !important'
  }
})

class DrawerScenario extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0
    }
    const that = this
    // if (this.props.database.simulation.active) {
      setInterval(function () {
        that.props.dispatch(asyncActions.getSimulation(process.env.webserver, that.props.appid))
        .then(data => {
          if (!data.simulation) return null
          if (data.simulation.datetime !== that.props.moment.initDate) {
            that.props.dispatch({ type: actions.SET_INITIAL_MOMENT_DATE, date: data.simulation.datetime })
            that.props.onMomentChange(that.props.moment.index)
            that.props.onApply(that.props.mapObject)
          }
        })
      }, 5000)
    // }
  }

  toggleSimulation = (e) => {
    const { appid } = this.props
    this.props.dispatch(asyncActions.setSimulationActive(process.env.webserver, appid, e))
      // .then(a => this.props.dispatch(asyncActions.getSimulation(process.env.webserver, this.props.appid)))
  }

  skipSimulationStep = () => {
    const { appid, database } = this.props
    // calculating wordt ook door de functie zelf op true gezet maar duurt lang voordat deze true is
    database.simulation.calculating = true
    this.props.dispatch(asyncActions.skipSimulationStep(process.env.webserver, appid))
    this.props.dispatch({ type: actions.SKIP_BUTTON_STATE, disabled: true })
  }

  handleStep = (index, speed) => {
    const { onChange } = this.props
    this.setState({ step: index })
    onChange(speed.id)
  }

  render() {
    const { application, classes, database, drawers, onClick, onClose, scenario } = this.props
    const { step } = this.state
    const tooltip = `${application.config.name} | ${application.config.customer} | ${packageJson.version}`

    let activeStep = Number(step)
    if (!database.simulation) return null
    let logo = `/static/images/${application.config.schema}/logo.png`
    if (process.env.type === 'app') {
      logo = `static/images/${application.config.schema}/logo.png`
    }


    return (
      <Drawer
        anchor="left"
        variant="persistent"
        classes={drawers.scenario ? { paper: classes.drawerPaper } : { paper: `${classes.drawerPaper} ${classes.hidden}` }}
        open={drawers.scenario}
      >
        <MenuHeader
          icon={<CloseIcon />}
          imageSrc={ logo }
          onClick={() => onClose('drawer_scenario')}
          titleText={'What if scenario analyse'}
          tooltip={tooltip}
          type={'left large'}
        />
        <Paper square className={ `${classes.contentInner} scenario-stepper` }>
          <Typography gutterBottom align="center" variant="h6">{ localDateTimeLong(application.config.locale, database.simulation.datetime) }</Typography>
          <div style={{textAlign: 'center'}}>
            {/* hier moeten div's omheen omdat de inhoud van <Tooltip> niet disabled mag zijn */}
            <Tooltip title='Start simulatie'>
              <div style={{display: 'inline-block'}}>
                <Fab className={classes.mediaIcon} disabled={!database.simulation ? false : database.simulation.active} size="small" color="primary" aria-label="Play" onClick={() => this.toggleSimulation(true)}>
                  <PlayIcon color="inherit" />
                </Fab>
              </div>
            </Tooltip>
            <Tooltip title='Pauzeer simulatie'>
              <div style={{display: 'inline-block'}}>
                <Fab className={classes.mediaIcon} disabled={!database.simulation ? true : !database.simulation.active} size="small" color="primary" aria-label="Pause" onClick={() => this.toggleSimulation(false)}>
                  <PauseIcon color="inherit" />
                </Fab>
              </div>
            </Tooltip>
            <Tooltip title='Volgende stap'>
              <div style={{display: 'inline-block'}}>
                <Fab className={classes.mediaIcon} disabled={
                    (database.simulation && database.simulation.calculating)
                    || (database.simulation && database.simulation.datetime >= database.simulation.endtime)
                  } size="small" color="primary" onClick={() => this.skipSimulationStep()}>
                  <SkipNextIcon color="inherit" />
                </Fab>
              </div>
            </Tooltip>
          </div>
          <Typography gutterBottom variant="h6">Simulatie</Typography>
          <div className={ classes.inlineFlex }>
            <Typography gutterBottom variant="body1">Afspeelsnelheid: </Typography>
            <Typography gutterBottom variant="body1">elke 10 minuten duurt 1 minuut</Typography>
          </div>
          <div className={ classes.inlineFlex }>
            <Typography variant="body1">Totale tijd simulatie: </Typography>
            <Typography variant="body1">{ !database.simulation ? null : msToTime(database.simulation.totaltime) }</Typography>
          </div>
          { !database.simulation || !database.simulation.speeds ? null :
          <Stepper
            nonLinear
            alternativeLabel
            activeStep={ activeStep }
            className={ classes.stepper }
          >
            {database.simulation.speeds.map((speed, index) => (
              <Step key={index}>
                <StepButton
                  disabled
                  icon={ false }
                  className={ `${classes.stepButton} stepper-button` }
                  onClick={ () => this.handleStep(index, speed) }
                >
                  <div className={ activeStep === index ? classes.stepIconActive : classes.stepIconActive }>
                    <StepIcon
                      active={ activeStep === index }
                      icon={ <FastForwardIcon /> }
                    />
                    <StepLabel classes={{label: activeStep === index ? classes.stepLabelActive : classes.stepLabelActive }}>{ speed.name }</StepLabel>
                  </div>
                </StepButton>
              </Step>
            ))}
          </Stepper> }
          <div className={ classes.inline }>
            <Button onClick={() => onClick('Belastingen')} variant="contained" className={ classes.button } color="primary">Selecteer een what-if scenario</Button>
          </div>
          { !database.simulation ? null :
          <React.Fragment>
            <div className={ classes.inlineFlex }>
              <Typography gutterBottom variant="body1">Naam:</Typography>
              <Typography gutterBottom variant="body1">{ database.simulation.scenarioname }</Typography>
            </div>
            <div className={ classes.inlineFlex }>
              <Typography gutterBottom variant="body1">Van:</Typography>
              <Typography gutterBottom variant="body1">{ localDateTime(application.config.locale,database.simulation.starttime) }</Typography>
            </div>
            <div className={ classes.inlineFlex }>
              <Typography variant="body1">Tot:</Typography>
              <Typography variant="body1">{ localDateTime(application.config.locale,database.simulation.endtime) }</Typography>
            </div>
          </React.Fragment> }
        </Paper>
      </Drawer>
    )
  }
}

DrawerScenario = withStyles(styles, { withTheme: true })(DrawerScenario)
export default connect(state => state)(DrawerScenario)
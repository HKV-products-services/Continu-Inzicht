import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import * as actions from '../../state/actions'

import { localDateTimeLong } from '../../lib/utils'
import Paper from '@material-ui/core/Paper'
import { roundFailure } from '../../lib'
import Slider from '@material-ui/lab/Slider'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import StepConnector from '@material-ui/core/StepConnector'
import StepIcon from '@material-ui/core/StepIcon'
import Typography from '@material-ui/core/Typography'

import './index.css'

const styles = theme => ({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    margin: 'auto',
    zIndex: 998,
    textAlign: 'center',
    [theme.breakpoints.up('xs')]: {
      maxWidth: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 400
    }
  },
  stepper: {
    padding: 0,
    margin: 'auto',
    [theme.breakpoints.up('xs')]: {
      width: '75%'
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  stepButton: {
    minHeight: 56,
    margin: 0,
    padding: theme.spacing(1),
    boxSizing: 'border-box'
  },
  uncertainty: {
    padding: theme.spacing(1),
    background: '#ffac33',
    color: 'white'
  },
  scenario: {
    padding: theme.spacing(1),
    background: '#9900ff',
    color: 'white'
  },
  date: {
    padding: `${theme.spacing(1)}px 0 ${theme.spacing(2)}px`
  },
  label: {
    marginTop: `${theme.spacing(1)}px !important`
  },
  iconButton: {
    width: '1.2em',
    height: '1.2em',
    marginBottom: theme.spacing(1)
  },
  iconText: {
    fontSize: theme.typography.pxToRem(10)
  },
  connector: {
    width: '80%',
    margin: '10px auto'
  },
  connectorSmall: {
    width: '80%',
    margin: `${theme.spacing(2)}px auto`
  },
  sliderContainer: {
    minHeight: '50px',
    padding: '25px 16px'
  }
})

class MomentStepper extends React.Component {
  constructor(props) {
    super(props)
    if (this.props.type !== 'slider') {
      // this.props.dispatch({ type: SET_MOMENT_DATE, date: this.props.database.appinfo.datetime })
      this.props.dispatch({ type: actions.SET_INITIAL_MOMENT_DATE, date: this.props.database.appinfo.datetime })
    }
  }

  // handleStep = (index, moment) => {
  //   console.log('moment', moment)
  //   if (this.props.onMomentChange) {
  //     this.props.onMomentChange(index)
  //   }
  // }

  render() {
    const { application, classes, database, menu, moment, type, uncertainty } = this.props
    let activeStep = Number(moment.index)
    const connector = (<StepConnector classes={{ line: classes.connector }} />)
    const connectorSmall = (<StepConnector classes={{ line: classes.connectorSmall }} />)
    if (type === 'hhnk') {
      const { moments } = this.props.database.appinfo
      return (
        <Paper square className={classes.container}>
          <div className={`moment-stepper ${classes.momentStepper}`}>
            <Stepper
              nonLinear
              alternativeLabel
              activeStep={activeStep}
              connector={connectorSmall}
              className={classes.stepper}
            >
              {moments.map((moment, index) => {
                let f = roundFailure(moment.percentage, 2)
                { f < 1 ? f = "<1%" : f = `${roundFailure(moment.percentage, 2)}%` }
                return (
                  <Step key={index}>
                    <StepButton
                      icon={false}
                      className={`${classes.stepButton} stepper-button`}
                      onClick={() => this.props.onMomentChange(index)}
                    >
                      {moment.index}
                    </StepButton>
                  </Step>
                )
              })}
            </Stepper>
          </div>
          {menu.index === 1
            ? <div style={{ display: 'block' }} className={classes.scenario}>
              <Typography variant="subtitle2" color="inherit">LET OP: u kijkt naar {uncertainty.alert ? `de ${uncertainty.name} van een` : 'een'} what-if scenario</Typography>
            </div>
            : <div style={{ display: uncertainty.alert ? 'block' : 'none' }} className={classes.uncertainty}>
              <Typography variant="subtitle2" color="inherit">LET OP: u kijkt naar de {uncertainty.name}</Typography>
            </div>
          }
        </Paper>
      )
    } else if (type === 'slider') {
      return (
        <Paper square className={classes.container}>
          <div className={`moment-stepper ${classes.momentStepper}`}>
            <Typography variant="subtitle2" className={classes.label}>{this.props.title}</Typography>
            <div className={classes.sliderContainer}>
              <Slider
                classes={{ container: classes.slider }}
                value={this.props.value}
                step={1}
                min={0}
                max={this.props.maxSlider}
                onChange={this.props.onChange}
              />
            </div>
          </div>
        </Paper>
      )
    } else {
      const { moments } = this.props.database.appinfo
      return (
        <Paper square className={classes.container}>
          <div className={`moment-stepper ${classes.momentStepper}`}>
            <Typography variant="subtitle2" className={classes.date}>{localDateTimeLong(application.config.locale, moments[moment.index].datetime)}</Typography>
            <Stepper
              nonLinear
              alternativeLabel
              activeStep={activeStep}
              connector={connector}
              className={classes.stepper}
            >
              {moments.map((moment, index) => {
                let percentage = 0.0
                const object = moment.percentages && moment.percentages.find(percentage => percentage.ensembleid === uncertainty.id)
                if (object) {
                  percentage = object.percentage
                }
                let f = roundFailure(percentage, 2)
                { f < 1 ? f = "<1%" : f = `${f}%` }
                return (
                  <Step key={index}>
                    <StepButton
                      icon={false}
                      className={`${classes.stepButton} stepper-button`}
                      onClick={() => this.props.onMomentChange(index)}
                    >
                      <StepIcon classes={{ root: classes.iconButton, text: classes.iconText }} active={activeStep === index} icon={`${moment.index}${moment.unit}`} />
                      {application.config.percentages ? f : null}
                    </StepButton>
                  </Step>
                )
              })}
            </Stepper>
          </div>
          {menu.index === 1
            ? <div style={{ display: 'block' }} className={classes.scenario}>
              <Typography variant="subtitle2" color="inherit">LET OP: u kijkt naar {uncertainty.alert ? `de ${uncertainty.name} van een` : 'een'} what-if scenario</Typography>
            </div>
            : <div style={{ display: uncertainty.alert ? 'block' : 'none' }} className={classes.uncertainty}>
              <Typography variant="subtitle2" color="inherit">LET OP: u kijkt naar de {uncertainty.name}</Typography>
            </div>
          }
        </Paper>
      )
    }
  }
}

MomentStepper = withStyles(styles, { withTheme: true })(MomentStepper)
export default connect(state => state)(MomentStepper)
import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import MobileStepper from '@material-ui/core/MobileStepper'
import Typography from '@material-ui/core/Typography'

import './index.css'

const styles = theme => ({
  container: {
    maxWidth: 960,
    margin: 'auto',
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      maxHeight: '100%'
    },
    [theme.breakpoints.up('md')]: {
      maxHeight: '600px'
    }
  },
  dialogTitle: {
    [theme.breakpoints.up('xs')]: {
      padding: `${ theme.spacing(2) }px ${ theme.spacing(1) }px ${ theme.spacing(1) }px`
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
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    height: '1%',
    marginBottom: theme.spacing(2)
  },
  dialogBottom: {
    display: 'flex',
    minHeight: 48,
    height: 48
  },
  dialogActions: {
    margin: 0
  },
  mobileStepper: {
    flexGrow: 1,
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(2)
  },
  button: {
    padding: theme.spacing(1),
    margin: 0
  }
})

class SectionDialogHhnk extends React.Component {

  render() {
    const { activeStep, application, classes, createSwipeableViews, dialogs, onChange, onClose, overlays, section, type } = this.props
    const overlay = application.config.map.overlays.find(overlay => overlay.key === 'vakindelingen')
    let title = null
    const maxSteps = 3
    if (!overlay.data) return null
    const features = overlay.data.features.find(feature => feature.properties.sectionid === overlays.id)
    if (activeStep === 1) {
      title = ', Faalmechanisme: GEBU'
    } else if (activeStep === 2) {
      title = ', Faalmechanisme: GEKB'
    } else {
      title = null
    }
    if (!features) return null
    return (
      <Dialog
        fullScreen={true}
        open={dialogs.section}
        className={classes.container}
        onBackdropClick={() => onClose('section')}
        maxWidth={false}
      >
        <DialogTitle disableTypography className={ classes.dialogTitle }>
          <Typography className={ classes.title } variant="h6">{`Traject: ${features.properties.name}, Vak: ${features.properties.sectionid}`}{title}</Typography>
        </DialogTitle>
        <DialogContent className={classes.contentOuter}>
          <div className={classes.contentInner}>
            { createSwipeableViews('section', features, type) }
          </div>
          <div className={classes.dialogBottom}>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              className={classes.mobileStepper}
              backButton={
                <Button className={classes.button} onClick={() => onChange('back')} disabled={activeStep === 0}>
                  <ChevronLeftIcon />
                  {window.innerWidth >= 600 ? 'Vorige' :  null }
                </Button>
              }
              nextButton={
                <Button className={classes.button} onClick={() => onChange('next')} disabled={activeStep === maxSteps - 1}>
                  {window.innerWidth >= 600 ? 'Volgende' :  null }
                  <ChevronRightIcon />
                </Button>
              }
            />
            <DialogActions className={classes.dialogActions}>
              <Button
                variant="contained"
                className={classes.button}
                color="primary"
                onClick={() => onClose('section')}
              >
                Ok
              </Button>
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

SectionDialogHhnk = withStyles(styles, { withTheme: true })(SectionDialogHhnk)
export default connect(state => state)(SectionDialogHhnk)
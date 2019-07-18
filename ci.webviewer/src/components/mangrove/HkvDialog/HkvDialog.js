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
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import MenuItem from '@material-ui/core/MenuItem'
import MobileStepper from '@material-ui/core/MobileStepper'
import Modal from '@material-ui/core/Modal'
import Select from '@material-ui/core/Select'
import SwipeableViews from 'react-swipeable-views'
import Typography from '@material-ui/core/Typography'

import './index.css'

const styles = theme => ({
  root: {
    margin: 'auto',
    textAlign: 'center',
    maxHeight: '100%'
  },
  small: {
    maxWidth: 960,
    minHeight: 300,
    height: 'auto'
  },
  default: {
    maxWidth: 960,
    [theme.breakpoints.up('sm')]: {
      maxHeight: '100%'
    },
    [theme.breakpoints.up('md')]: {
      maxHeight: 600
    }
  },
  large: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: '100%',
      maxHeight: '100%'
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: `calc(100% - ${theme.spacing(8 * 2)}px)`,
      maxHeight: `calc(100% - ${theme.spacing(8 * 2)}px)`
    }
  },
  dialogTitle: {
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'column-reverse',
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(1)}px`
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      padding: theme.spacing(3)
    }
  },
  flexTitle: {
    '& h6': {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  title: {
    flexGrow: 100,
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
    justifyContent: 'center',
    flexGrow: 1,
    height: '1%',
    marginBottom: theme.spacing(2),
    overflow: 'auto'
  },
  dialogBottom: {
    display: 'flex',
    alignSelf: 'flex-end',
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
    margin: `0 0 0 ${theme.spacing(2)}px`,
    '&:first-of-type': {
      margin: 0
    }
  },
  hidden: {
    display: 'none'
  },
  form: {
    flexGrow: 1,
    textAlign: 'left',
    [theme.breakpoints.up('xs')]: {
      marginBottom: theme.spacing(1),
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      marginBottom: 'unset',
      width: 'unset'
    }
  },
  formControl: {
    minWidth: 100,
    [theme.breakpoints.up('xs')]: {
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      width: 'unset'
    }
  },
  progress: {
    minHeight: 4,
    marginBottom: theme.spacing(0.5)
  },
  paper: {
    position: 'absolute',
    height: `calc(100% - ${theme.spacing(16)}px)`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none'
  },
  inputLabel: {
    width: 200
  }
})

class HkvDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeDialogs: [],
      activeTemp: [],
      selection: null
    }
  }

  handleStep = (dialog, type) => {
    const { application, onConditionChange } = this.props
    let activeTemp = this.state.activeTemp
    if (!dialog.index) {
      dialog.index = 1
    } else {
      dialog.index = type === 'next' ? dialog.index + 1 : dialog.index - 1
    }
    if (!activeTemp.find(e => e === dialog.key)) {
      activeTemp.push(dialog.key)
    }
    const activeDialogs = {}
    activeTemp.forEach(temp => {
      activeDialogs[temp] = temp === dialog.key ? dialog.index : application.config.dialogs.find(dialog => dialog.key === temp).index
    })
    // TODO
    // deze if () weghalen
    // naam
    if (dialog.key === 'Basisveiligheid') {
      onConditionChange(dialog.index)
    }
    this.setState({activeDialogs: activeDialogs})
  }

  resetSteps = () => {
    // Mobile stepper wordt gereset naar stap1, de selectie in de state wordt ook gereset
    this.setState({ activeStep: 0, selection: null })
  }

  handleChange = (e) => {
    const { dialog, handleDialogTitleChange } = this.props
    const value = e.target.value
    this.setState({selection: value})
    handleDialogTitleChange(e, dialog)
  }

  renderdialogTitle = () => {
    const { dialog, overlays } = this.props
    switch (dialog.title.type) {
      case 'name':
      default:
        return dialog.title.name
      case 'name+feature':
        return `${dialog.title.name} ${overlays.name}`
      case 'feature':
        return overlays.name
    }
  }

  renderDialogButton = (action, index) => {
    const { classes, disabled, handleClick } = this.props
    // alleen index meegeven aan functie voor het sluiten van een modal, de array met modals wordt gespliced met deze index
    return (
      <Button
        key={`${index}-${action.name}`}
        variant="contained"
        className={classes.button}
        color="primary"
        disabled={action.function === 'apply' && disabled === true ? true : false}
        onClick={() => handleClick(action.function, action.function === 'closeModal' && index)}
      >
        {action.name}
      </Button>
    )
  }

  renderDialogBottom = (dialog, index) => {
    const { classes } = this.props
    switch (dialog.type) {
      case 'swipeableModal':
      case 'swipeable':
        const stepper = document.getElementById('stepper')
        return (
          <div className={classes.dialogBottom} style={{width: '100%'}}>
            <MobileStepper
              id='stepper'
              steps={dialog && dialog.views.length}
              position="static"
              activeStep={this.state.activeDialogs[dialog.key]}
              className={classes.mobileStepper}
              backButton={
                <Button className={classes.button} onClick={() => this.handleStep(dialog, 'back')} disabled={this.state.activeDialogs[dialog.key] ? this.state.activeDialogs[dialog.key] === 0 : true}>
                  <ChevronLeftIcon />
                  {stepper && stepper.offsetWidth >= 320 ? 'Vorige' : null}
                </Button>
              }
              nextButton={
                <Button className={classes.button} onClick={() => this.handleStep(dialog, 'next')} disabled={this.state.activeDialogs[dialog.key] ? this.state.activeDialogs[dialog.key] === dialog.views.length - 1 : false}>
                  {stepper && stepper.offsetWidth >= 320 ? 'Volgende' : null}
                  <ChevronRightIcon />
                </Button>
              }
            />
            <DialogActions className={classes.dialogActions}>
              {dialog.dialogBottom.actions.map(action => (
                this.renderDialogButton(action, index)
              ))}
            </DialogActions>
          </div>
        )
      case 'modal':
      case 'simple':
      default:
        return (
          <div className={classes.dialogBottom}>
            <DialogActions>
              {dialog.dialogBottom.actions.map(action => (
                this.renderDialogButton(action, index)
              ))}
            </DialogActions>
          </div>
        )
    }
  }

  renderDialogContent = () => {
    const { classes, database, dialog, renderDialogContent, selectedOptions } = this.props
    return (
      <React.Fragment>
        <DialogTitle align='center' disableTypography className={classes.dialogTitle}>
          {dialog && dialog.titleActions && dialog.titleActions.map((action, index) => {
            const actionVal = action.options.find(o => o.value == selectedOptions[index])
            return (
              <form key={index} autoComplete="off" className={classes.form}>
                <FormControl className={classes.formControl}>
                  {action.label && <InputLabel className={classes.inputLabel}>{action.label}</InputLabel>}
                  <Select
                    disabled={action.disabled}
                    value={actionVal && actionVal.value}
                    name={dialog.titleActions[index]}
                    onChange={(e) => this.handleChange(e)}
                  >
                    {action.options.map((option, index) => (
                      <MenuItem key={index} value={option.value}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </form>
            )})}
          <Typography className={classes.title} variant="h6">{`${dialog && dialog.title && this.renderdialogTitle()}`}</Typography>
        </DialogTitle>
        <DialogContent className={classes.contentOuter}>
          <LinearProgress className={`${classes.progress} ${database.dialogLoading ? null : classes.hidden}`} />
          <div className={classes.contentInner}>
            {dialog && dialog.type === 'swipeable'
              ? <SwipeableViews
                index={this.state.activeDialogs[dialog.key]}
                className={'swipeableview'}
              >
                {renderDialogContent(dialog)}
              </SwipeableViews>
              : renderDialogContent(dialog)
            }
          </div>
          {dialog && this.renderDialogBottom(dialog)}
        </DialogContent>
      </React.Fragment>
    )
  }

  renderSubTitle = (activeModal) => {
    return activeModal.views[this.state.activeDialogs[activeModal.key] ? this.state.activeDialogs[activeModal.key] : 0 ].subtitle
  }

  renderModalContent = (modal, index) => {
    const { classes, database, dialog, renderModalContent } = this.props
    const activeModal = this.props.application.config.dialogs.find(dialog => dialog.key === modal)
    return (
      <React.Fragment>
        <DialogTitle align='center' disableTypography className={`${classes.dialogTitle} ${classes.flexTitle}`}>
          <Typography className={classes.title} variant="h6">{activeModal.title.name}<span style={{fontWeight: 400, fontSize: '1rem'}}>{this.renderSubTitle(activeModal)}</span></Typography>
        </DialogTitle>
        <DialogContent className={classes.contentOuter}>
          <LinearProgress className={`${classes.progress} ${database.dialogLoading ? null : classes.hidden}`} />
          <div className={classes.contentInner}>
            {activeModal && activeModal.type === 'swipeable' || activeModal && activeModal.type === 'swipeableModal'
              ? <SwipeableViews
                index={this.state.activeDialogs[activeModal.key]}
                className={'swipeableview'}
              >
                {renderModalContent(activeModal)}
              </SwipeableViews>
              : renderModalContent(activeModal)
            }
          </div>
          {dialog && this.renderDialogBottom(activeModal, index)}
        </DialogContent>
      </React.Fragment>
    )
  }

  render() {
    const { classes, dialog, dialogs, theme } = this.props
    if (dialog && dialog.titleActions && dialog.titleActions.hiddenSelect) {
      const select = Array.from(document.getElementsByClassName('vega-bindings'))[0]
      select && select.classList.add('displayNone')
    }
    const size = classes[dialog && dialog.size]
    if (dialog && dialog.type === 'modal' || dialog && dialog.type === 'swipeableModal') {
      return dialogs.state.modals.map((modal, index) => {
        // let left = `calc(75% / 3 * (${index} + 1))`
        let left = []
        switch (dialogs.state.modals.length) {
          case 1:
          default:
            left[0] = '50%'
            break;
          case 2:
            left[1] = '33.3333%'
            left[0] = '66.6666%'
            break;
          case 3:
            left[2] = '25%'
            left[1] = '50%'
            left[0] = '75%'
            break;
        }
        let modalStyle = {
          display: 'flex',
          flexDirection: 'column',
          width: `calc((${100}% / ${(dialogs.state.modals.length + 1)}) - ${theme.spacing(2)}px)`,
          top: `${50}%`,
          left: left[index],
          transform: `translate(-${50}%, -${50}%)`,
          pointerEvents: 'all'
        }
        return (
          <Modal
            disableAutoFocus
            disableEnforceFocus
            key={index}
            style={{pointerEvents: 'none'}}
            hideBackdrop
            disableBackdropClick
            open={modal[Object.keys(modal)[0]]}
          >
            <div style={modalStyle} className={classes.paper}>
              {this.renderModalContent(Object.keys(modal)[0], index)}
            </div>
          </Modal>
        )
      })
    } else {
      return (
        <Dialog
          fullScreen
          open={dialogs.state === null ? false : dialogs.state}
          classes={{paper: `${classes.root} ${size}`}}
          onBackdropClick={() => this.props.handleClick('closeDialog')}
          onEnter={this.resetSteps}
        >
          {this.renderDialogContent()}
        </Dialog>
      )
    }
  }
}

HkvDialog = withStyles(styles, { withTheme: true })(HkvDialog)
export default connect(state => state)(HkvDialog)
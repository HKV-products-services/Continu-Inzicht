import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  header: {
    flexDirection: 'row',
    position: 'sticky',
    top: theme.spacing(1),
    margin: theme.spacing(1),
    padding: `0 ${theme.spacing(1)}px !important`,
    background: theme.palette.primary.main,
    width: `calc(100% - ${theme.spacing(2)}px)`
  },
  image: {
    height: theme.spacing(5),
    padding: `${theme.spacing(0.5)}px 0`,
    width: 'auto',
    boxSizing: 'content-box'
  },
  headerIcon: {
    height: theme.spacing(6),
    width: 'auto'
  },
  button: {
    '&:hover': {
      background: 'transparent'
    }
  },
  headerText: {
    flexGrow: 1,
    display: 'grid',
    margin: `0 0 0 ${theme.spacing(1)}px`,
    fontWeight: 400,
    '&::before': {
      content: '" "',
      display: 'inline-block'
    }
  },
  headerTextXs: {
    fontSize: theme.typography.pxToRem(13)
  },
  headerTextS: {
    fontSize: theme.typography.pxToRem(14)
  },
  headerTextM: {
    fontSize: theme.typography.pxToRem(15)
  },
  headerTextL: {
    fontSize: theme.typography.pxToRem(16)
  },
  headerTextXL: {
    fontSize: theme.typography.pxToRem(20)
  },
  indicator: {
    backgroundColor: theme.palette.primary[50]
  },
  rotate: {
    marginRight: theme.spacing(1),
    transform: 'rotate(90deg)'
  }
})

class MenuHeader extends React.Component {

  switchClass = (length) => {
    if (length >= 22 && length <= 25) {
      return 'headerTextL'
    } else if (length > 25 && length <= 30) {
      return 'headerTextM'
    } else if (length > 30 && length <= 35) {
      return 'headerTextS'
    } else if (length > 35) {
      return 'headerTextXs'
    } else {
      return 'headerTextXL'
    }
  }

  switchFontSize = (titleText, type) => {
    const { classes } = this.props
    if (type === 'left large') {
      return <Typography className={`${classes.headerText} ${classes.headerTextXL}`} variant="h6" color="inherit">{titleText}</Typography>
    } else {
      return <Typography className={`${classes.headerText} ${classes[this.switchClass(titleText.length)]}`} variant="h6" color="inherit">{titleText}</Typography>
    }
  }

  renderIcon = () => {
    const { classes, icon, onClick, type } = this.props
    return <IconButton
      className={`${classes.headerIcon} ${type ==='bottom' && classes.rotate}`}
      color="inherit"
      onClick={() => onClick()}
    >
      {icon}
    </IconButton>
  }

  render() {
    const { activeStep, classes, imageSrc, onSpecChange, onToggle, snackbarIcon, tabs, theme, titleText, type, tooltip } = this.props
    if (type === 'left' || type === 'left large') {
      return (
        <AppBar className={classes.header}>
          <Tooltip title={tooltip}>
            <img src={imageSrc} className={classes.image} />
          </Tooltip>
          {this.switchFontSize(titleText, type)}
          {this.renderIcon()}
        </AppBar>
      )
    } else if (type === 'right') {
      return (
        <AppBar className={classes.header}>
          <img src={imageSrc} className={classes.image} />
          {this.renderIcon()}
          {titleText && this.switchFontSize(titleText, type)}
        </AppBar>
      )
    } else {
      return (
        <AppBar className={classes.header} style={{top: theme.spacing(1) + theme.spacing(0.5)}}>
          {this.renderIcon()}
          <Tabs
            classes={{indicator: classes.indicator}}
            scrollButtons='off'
            style={{flexGrow: 1}}
            value={activeStep}
            variant='scrollable'
          >
            {tabs && tabs.map((tab, index) => {
              if (onSpecChange) {
                return <Tab style={{display: tab.active === true ? 'block' : 'none'}} key={index} value={index} label={tab.name} onClick={() => {onSpecChange(index, tab)}} />
              } else {
                return <Tab key={index} value={index} label={tab.name} />
              }
            })}
          </Tabs>
          <IconButton
            className={`${classes.headerIcon} ${classes.button}`}
            color="inherit"
            disableRipple
            onClick={() => onToggle()}
          >
            {snackbarIcon}
          </IconButton>
        </AppBar>
      )
    }
  }
}

MenuHeader = withStyles(styles, { withTheme: true })(MenuHeader)
export default connect(state => state)(MenuHeader)
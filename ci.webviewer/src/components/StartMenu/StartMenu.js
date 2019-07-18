import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import * as actions from '../../state/actions'
const { START_DIALOG_STATE } = actions

import BeslissenIcon from '@material-ui/icons/Help'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Dialog from '@material-ui/core/Dialog'
import RapportagesIcon from '@material-ui/icons/LibraryBooks'
import RealTimeIcon from '@material-ui/icons/Visibility'
import RisicoIcon from '@material-ui/icons/SettingsApplications'
import ScenarioIcon from '@material-ui/icons/Update'
import Typography from '@material-ui/core/Typography'

import './index.css'

const styles = theme => ({
  root: {
    margin: theme.spacing(2)
  },
  dialogTitle: {
    width: '100%',
    color: 'white',
    fontWeight: 500,
    marginBottom: theme.spacing(1),
    pointerEvents: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(28)
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(32)
    },
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.pxToRem(48)
    }
  },
  dialogSubTitle: {
    width: '100%',
    color: 'white',
    fontWeight: 500,
    pointerEvents: 'none',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
      fontSize: theme.typography.pxToRem(20)
    },
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(1),
      fontSize: theme.typography.pxToRem(24)
    },
    [theme.breakpoints.up('md')]: {
      marginBottom: 0,
      fontSize: theme.typography.pxToRem(34)
    }
  },
  card: {
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      margin: `${theme.spacing(2)}px auto 0`,
      '&:first-of-type': {
        margin: '0 auto'
      }
    },
    [theme.breakpoints.up('md')]: {
      height: '100%',
      margin: theme.spacing(2),
      '&:first-of-type': {
        margin: theme.spacing(2)
      }
    }
  },
  smallCard: {
    height: 'inherit',
    [theme.breakpoints.down('sm')]: {
      width: '75%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
    [theme.breakpoints.up('md')]: {
      width: 250,
    }
  },
  largeCard: {
    [theme.breakpoints.down('sm')]: {
      width: '75%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '50%'
    },
    [theme.breakpoints.up('md')]: {
      width: 380,
    }
  },
  cardActionArea: {
    height: '100%',
    [theme.breakpoints.up('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'space-between'
    },
    [theme.breakpoints.up('md')]: {
      display: 'block',
      flexDirection: 'unset',
    }
  },
  cardActionAreaWLinks: {
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100% - 42px)'
    },
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 52px)'
    },
    [theme.breakpoints.up('md')]: {
      height: '100%'
    }
  },
  cardContent: {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(1)
    }
  },
  iconContent: {
    '&:last-child': {
      paddingBottom: theme.spacing(1)
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1)
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2)
    }
  },
  media: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      height: '70%',
      maxHeight: '70%'
    },
    [theme.breakpoints.up('md')]: {
      height: 160
    }
  },
  cardText: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(10)
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(14)
    }
  },
  content: {
    marginTop: '0.35em',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    [theme.breakpoints.up('md')]: {
      display: 'block'
    }
  },
  dialogActions: {
    display: 'block',
    float: 'right',
    padding: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px 0`
  },
  button: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px 0`,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(10),
      minWidth: 'unset',
      lineHeight: 1.5
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(14),
      minWidth: 64,
      lineHeight: 1.75
    }
  },
  disabled: {
    opacity: 0.25,
    pointerEvents: 'none',
    '&::before': {
      content: '" "',
      position: 'absolute',
      left: 0,
      right: 0,
      height: '100%',
      width: '100%'
    }
  },
  icon: {
    width: '100%',
    color: '#2196f3',
    display: 'block',
    [theme.breakpoints.down('md')]: {
      height: 'auto'
    },
    [theme.breakpoints.up('md')]: {
      height: '100%'
    }
  },
  cardTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(20)
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(24)
    }
  },
  cardSubTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(16)
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(20)
    }
  },
  label: {
    zIndex: 1,
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(16)
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(20)
    },
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.pxToRem(24)
    }
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: `0 0 ${theme.spacing(1)}px 0`
  },
  headerContent: {
    width: `calc(100% / 2 - ${theme.spacing(1)}px)`,
    alignSelf: 'center'
  }
})

class StartMenu extends React.Component {

  closeDialog = () => {
    this.props.dispatch({
      type: START_DIALOG_STATE,
      open: false
    })
  }

  switchImage = (schema, index) => {
    return `./static/images/${schema}/startmenu-${index}.jpg`
  }

  switchIcon = (label) => {
    const { classes } = this.props
    switch (label) {
      case 'Real time inzicht':
        return <RealTimeIcon className={classes.icon} />
      case 'What-if inzicht':
        return <ScenarioIcon className={classes.icon} />
      case 'Rapportages - zorgplicht':
      case 'Rapportages':
        return <RapportagesIcon className={classes.icon} />
      case 'Risicogestuurd beheer':
        return <RisicoIcon className={classes.icon} />
      case 'Beslissen onder onzekerheid':
      default:
        return <BeslissenIcon className={classes.icon} />
    }
  }

  createMarkup = (description) => {
    return { __html: description }
  }

  switchCardType = (menuItem, schema) => {
    const { application, classes, onClick } = this.props
    switch(menuItem.type) {
      case 'card':
        return (
          <CardActionArea className={classes.cardActionArea} onClick={() => onClick(menuItem)}>
            <CardMedia
              className={classes.media}
              image={this.switchImage(schema, menuItem.index)}
              title={menuItem.label}
            />
            <CardContent className={`card-content ${classes.cardContent} ${menuItem.textAlign}`}>
              <Typography className={classes.cardTitle} variant="h5" component="h2">{menuItem.label}</Typography>
              {menuItem.subTitle && <Typography className={classes.cardSubTitle} variant="h5" component="h2">{menuItem.subTitle}</Typography>}
              {menuItem.descriptionMobile
                ? <Typography dangerouslySetInnerHTML={this.createMarkup(menuItem.description)} className={classes.cardText} />
                : <Typography dangerouslySetInnerHTML={this.createMarkup(menuItem.description)} className={`${classes.content} ${classes.cardText}`} />
              }
            </CardContent>
          </CardActionArea>
        )
      case 'actionCard':
        return (
          <CardActionArea className={`${classes.cardActionArea} ${classes.cardActionAreaWLinks}`} onClick={() => onClick(menuItem)}>
            {menuItem.cardImage &&
              <CardMedia
                className={classes.media}
                image={this.switchImage(schema, menuItem.index)}
                title={menuItem.label}
              />
            }
            <CardContent className={`card-content ${classes.cardContent} ${menuItem.textAlign}`}>
              {menuItem.titleImage
                ? <div className={classes.headerContainer}>
                  <div className={classes.headerContent}>
                    <Typography className={classes.cardTitle} variant="h5" component="h2">{menuItem.label}</Typography>
                    {menuItem.subTitle && <Typography className={classes.cardSubTitle} variant="h5" component="h2">{menuItem.subTitle}</Typography>}
                  </div>
                  <div className={classes.headerContent}>
                    <img width="100%" src={`./static/images/${application.config.schema}/${menuItem.titleImage}`} />
                  </div>
                </div>
                :
                <div>
                  <Typography className={classes.cardTitle} variant="h5" component="h2">{menuItem.label}</Typography>
                  {menuItem.subTitle && <Typography className={classes.cardSubTitle} variant="h5" component="h2">{menuItem.subTitle}</Typography>}
                </div>
              }
              {menuItem.descriptionMobile
                ? <Typography dangerouslySetInnerHTML={this.createMarkup(menuItem.description)} className={classes.cardText} />
                : <Typography dangerouslySetInnerHTML={this.createMarkup(menuItem.description)} className={`${classes.content} ${classes.cardText}`} />
              }
            </CardContent>
          </CardActionArea>
        )
      default:
        return (
          <div className={`${classes.cardActionArea} ${classes.cardActionAreaWLinks}`}>
            {menuItem.cardImage &&
              <CardMedia
                className={classes.media}
                image={this.switchImage(schema, menuItem.index)}
                title={menuItem.label}
              />
            }
            <CardContent className={`card-content ${classes.cardContent} ${menuItem.textAlign}`}>
              {menuItem.titleImage
                ? <div className={classes.headerContainer}>
                  <div className={classes.headerContent}>
                    <Typography className={classes.cardTitle} variant="h5" component="h2">{menuItem.label}</Typography>
                    {menuItem.subTitle && <Typography className={classes.cardSubTitle} variant="h5" component="h2">{menuItem.subTitle}</Typography>}
                  </div>
                  <div className={classes.headerContent}>
                    <img width="100%" src={`./static/images/${application.config.schema}/${menuItem.titleImage}`} />
                  </div>
                </div>
                :
                <div>
                  <Typography className={classes.cardTitle} variant="h5" component="h2">{menuItem.label}</Typography>
                  {menuItem.subTitle && <Typography className={classes.cardSubTitle} variant="h5" component="h2">{menuItem.subTitle}</Typography>}
                </div>
              }
              {menuItem.descriptionMobile
                ? <Typography dangerouslySetInnerHTML={this.createMarkup(menuItem.description)} className={classes.cardText} />
                : <Typography dangerouslySetInnerHTML={this.createMarkup(menuItem.description)} className={`${classes.content} ${classes.cardText}`} />
              }
            </CardContent>
          </div>
        )
    }
  }

  renderImageMenu = (menuItem, schema, index) => {
    const { classes, onClick } = this.props
    if (menuItem.active) {
      return (
        <Card
          key={index}
          style={menuItem.customWidth
            ? { width: window.innerWidth <= menuItem.customWidth ? '100%' : `${menuItem.customWidth}px` }
            : null
          }
          className={`${classes.card} ${menuItem.customWidth ? null : classes.largeCard}`}
        >
          <Link href={`${window.location.pathname}${menuItem.key}`}>
            {this.switchCardType(menuItem, schema)}
          </Link>
          {menuItem.link &&
            <div className={classes.dialogActions}>
              {menuItem.link.map((item, index) => (
                <Button
                  className={classes.button}
                  color="primary"
                  component='a'
                  href={item.link}
                  key={index}
                  onClick={() => onClick(menuItem, item)}
                  target={item.target}
                  variant="contained"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          }
        </Card>
      )
    } else {
      return (
        <Card key={index} className={`${classes.card} ${classes.largeCard}`}>
          <CardActionArea className={`${classes.cardActionArea} ${classes.disabled}`}>
            <CardMedia
              className={classes.media}
              image={this.switchImage(schema, menuItem.index)}
              title={menuItem.label}
            />
            <CardContent className={`card-content ${classes.cardContent} ${menuItem.textAlign}`}>
              <Typography className={classes.cardTitle} variant="h5" component="h2">{menuItem.label}</Typography>
              {menuItem.subTitle && <Typography className={classes.cardSubTitle} variant="h5" component="h2">{menuItem.subTitle}</Typography>}
              {menuItem.descriptionMobile
                ? <Typography dangerouslySetInnerHTML={this.createMarkup(menuItem.description)} className={classes.cardText} />
                : <Typography dangerouslySetInnerHTML={this.createMarkup(menuItem.description)} className={`${classes.content} ${classes.cardText}`} />
              }
            </CardContent>
          </CardActionArea>
          {menuItem.link &&
            <div className={classes.dialogActions}>
              {menuItem.link.map((item, index) => (
                <Button
                  className={classes.button}
                  color="primary"
                  key={index}
                  variant="contained"
                  disabled
                >
                  {item.label}
                </Button>
              ))}
            </div>
          }
        </Card>
      )
    }
  }

  renderIconMenu = (menuItem, index) => {
    const { classes, onClick } = this.props
    if (menuItem.active) {
      return (
        // <Link key={index} href={`${window.location.pathname}${menuItem.key}`}>
          <Card key={index} className={`${classes.card} ${classes.smallCard}`} onClick={() => onClick(menuItem)}>
            <CardActionArea className={classes.cardActionArea}>
              <div className={classes.media}>{this.switchIcon(menuItem.label)}</div>
              <CardContent className={classes.iconContent}>
                <Typography className={classes.label} variant="h5" component="h2">{menuItem.label}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        // </Link>
      )
    } else {
      return (
        <Card key={index} className={`${classes.card} ${classes.smallCard}`}>
          <CardActionArea className={`${classes.cardActionArea} ${classes.disabled}`}>
            <div className={classes.media}>{this.switchIcon(menuItem.label)}</div>
            <CardContent className={classes.iconContent}>
              <Typography className={classes.label} variant="h5" component="h2">{menuItem.label}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )
    }
  }

  render() {
    const { application, classes, dialogs, url } = this.props    
    return (
      <Dialog
        fullScreen={true}
        open={dialogs.start}
        className={`startmenu-container ${classes.root}`}
        disableBackdropClick
      >
        <Typography variant="h3" className={classes.dialogTitle}>{application.config.name}</Typography>
        <Typography variant="h4" className={classes.dialogSubTitle}>{application.config.customer}</Typography>
        {application.config.startMenu && application.config.startMenu.map((menuItem, index) => {
          if (application.config.startMenuStyle === 'images') {
            return this.renderImageMenu(menuItem, application.config.schema, index)
          } else {
            return this.renderIconMenu(menuItem, index)
          }
        })}
      </Dialog>
    )
  }
}

StartMenu = withStyles(styles, { withTheme: true })(StartMenu)
export default connect(state => state)(StartMenu)
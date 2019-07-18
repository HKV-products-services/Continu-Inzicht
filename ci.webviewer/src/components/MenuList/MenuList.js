import React from 'react'
import Link from 'next/link'
import { withStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import ReportsMenu from '../ReportsMenu'

import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const styles = theme => ({
  paper: {
    margin: `0 ${theme.spacing(1)}px`
  },
  menuList: {
    margin: 0,
    width: '100%',
    padding: `0 0 ${theme.spacing(1)}px 0`,
    '&:last-of-type': {
      display: 'flex',
      flexDirection: 'column-reverse',
      flexGrow: 1,
      flexShrink: 'inherit'
    },
    '&:first-of-type': {
      position: 'relative',
      bottom: 'unset'
    }
  },
  expansionPanel: {
    '&:first-child': {
      borderRadius: 0
    },
    '&:last-child': {
      borderRadius: 0
    }
  },
  expansionPanelSummary: {
    padding: `0 ${theme.spacing(2)}px`
  },
  expansionPanelDetails: {
    flexDirection: 'column'
  },
  formControl: {
    marginRight: 0
  },
  // formControlLabel: {
  //   fontSize: theme.typography.pxToRem(14)
  // }
})

class MenuList extends React.Component {

  renderListItem = (label) => {
    return <ListItemText>{label}</ListItemText>
  }
  
  renderCheckbox(menuItem) {
    const { classes, onClick, openModals } = this.props
    // checked zetten wanneer modal open is
    let checked = openModals && openModals.find(openModal => openModal.key === menuItem.key)
    // initieel worden de ze op false gezet maar wanneer er 1 true is is de rest undefined,
    // je krijgt een foutmelding wanneer je alleen checked (undefined) zou gebruiken, vandaar de true/false check
    return <Checkbox
      checked={checked && checked[menuItem.key] === true ? true : false}
      className={classes.select}
      color="primary"
      disableRipple
      onChange={() => onClick(menuItem.key)}
    />
  }

  render() {
    const { appid, application, classes, menuList, menuLabel, onClick, url } = this.props
    return (
      // TODO - generiek / temp eruit
      // - Reports menu renderd nu wanneer menuList een lege array is
      <React.Fragment>
        <List className={classes.menuList}>
          <Paper square className={classes.paper}>
            {menuLabel === 'Rapportages'
              ? <ReportsMenu appid={appid} />
              : menuList.map((menuItem, index) => {
                if (menuItem.key === undefined) return null
                if (menuItem.target === 'blank') {
                  if (menuItem.hideInApp && process.env.type === 'app') return null
                  return (
                    <Link key={index} href={menuItem.key}>
                      <a style={{ textDecoration: 'none', active: 'none', focus: 'none', color: 'inherit' }} target="_blank">
                        <ListItem button>
                          {this.renderListItem(menuItem.label)}
                        </ListItem>
                      </a>
                    </Link>
                  )
                } else {
                  if (menuItem.hideInApp && process.env.type === 'app') return null
                  return (
                    <ListItem button key={index} onClick={() => onClick(menuItem.label)}>
                      {this.renderListItem(menuItem.label)}
                    </ListItem>
                  )
                }
              })}
          </Paper>
        </List>
        {application.config.settingsMenu &&
          <List className={classes.menuList}>
            <Paper square className={classes.paper}>
              {application.config.settingsMenu.map((menuItem, index) => {
                if (menuItem.key === undefined) return null
                if (menuItem.target === 'blank') {
                  if (menuItem.hideInApp && process.env.type === 'app') return null
                  return (
                    <Link key={index} href={menuItem.key}>
                      <a style={{ textDecoration: 'none', active: 'none', focus: 'none', color: 'inherit' }} target="_blank">
                        <ListItem button>
                          {this.renderListItem(menuItem.label)}
                        </ListItem>
                      </a>
                    </Link>
                  )
                } else {
                  if (menuItem.hideInApp && process.env.type === 'app') return null
                  return (
                    <ListItem button key={index} onClick={() => onClick(menuItem.label)}>
                      {this.renderListItem(menuItem.label)}
                    </ListItem>
                  )
                }
              })}
            </Paper>
          </List>
        }
        {application.config.analyseMenu &&
          <FormControl component="fieldset" className={classes.menuList}>
            <FormGroup className={classes.paper}>
              <ExpansionPanel
                className={classes.expansionPanel}
                defaultExpanded
              >
                <ExpansionPanelSummary className={classes.expansionPanelSummary} expandIcon={< ExpandMoreIcon />}>
                  <Typography>Analyse</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                  {application.config.analyseMenu.map((menuItem, index) => (
                    <RadioGroup key={index}>
                      <FormControlLabel
                        className={classes.formControl}
                        control={this.renderCheckbox(menuItem)}
                        label={menuItem.label}
                        classes={{label: classes.formControlLabel}}
                      />
                    </RadioGroup>
                  ))}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </FormGroup>
          </FormControl>
        }
        <List className={classes.menuList}>
          {application.config.subMenu &&
            <Paper square className={classes.paper}>
              {application.config.subMenu.map((menuItem, index) => {
                // TODO
                if (process.env.type === 'web' && menuItem.hideInWeb) return null
                if (menuItem.dialog) {
                  return (
                    <ListItem button key={index} onClick={() => onClick(menuItem.label)}>
                      {this.renderListItem(menuItem.label)}
                    </ListItem>
                  )
                } else {
                  return (
                    <Link key={index} href={`${url}${menuItem.key}`}>
                      <ListItem button>
                        {this.renderListItem(menuItem.label)}
                      </ListItem>
                    </Link>
                  )
                }
              })}
            </Paper>
          }
        </List>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(MenuList)
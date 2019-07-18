import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'

import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const styles = theme => ({
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
  expansionPanelDetails: {
    flexDirection: 'column'
  },
  menuList: {
    margin: theme.spacing(1),
    padding: 0,
    '&:first-child': {
      bottom: 'unset',
      position: 'relative',
    },
    '&:last-child': {
      display: 'flex',
      flexShrink: 'inherit',
      flexDirection: 'column',
    }
  },
  subMenuImage: {
    textAlign: 'center',
    padding: `0 ${theme.spacing(2)}px ${theme.spacing(1)}px`
  }
})

class MenuAccordion extends React.Component {

  renderListItem = (label) => {
    return <ListItemText>{label}</ListItemText>
  }

  switchFunction = (value) => {
    const { toggleSteps } = this.props
    switch(value) {
      case 'toggleSteps':
        toggleSteps()
    }
  }

  renderSubmenu = (menuItem) => {
    const { url } = this.props
    switch(menuItem.function && menuItem.function.type) {
      case false:
      case null:
      case undefined:
        return (
          <ListItem
            button
            component='a'
            href={menuItem.target == '_blank' ? menuItem.key : `${url}${menuItem.key}`} 
            target={menuItem.target}
          >
            <ListItemText>
              {menuItem.value}
            </ListItemText>
          </ListItem>
        )
      case 'onClick':
      return (
        <ListItem
          button
          component='a'
          href={menuItem.target == '_blank' ? menuItem.key : `${url}${menuItem.key}`} 
          target={menuItem.target}
          onClick={() => this.switchFunction(menuItem.function.value)}
        >
          <ListItemText>
            {menuItem.value}
          </ListItemText>
        </ListItem>
      )
    }
  }

  switchSubMenuType = (menuItem, index) => {
    //console.log('menuItem', menuItem)
    const { classes } = this.props
    switch(menuItem.type) {
      case 'image':
        return (
          <a href={menuItem.key} target={menuItem.target} key={index} className={classes.subMenuImage}>
            <img width='70%' src={menuItem.value} />
          </a>
        )
      case 'text':
      default:
        return (
          <Paper key={index} square style={{zIndex: 1}}>
            {this.renderSubmenu(menuItem)}
          </Paper>
        )
    }
  }

  render() {
    const { application, classes, handleExpansionPanel, expandedPanel, onClick, renderAccordion, url } = this.props
    return (
      <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
        <div style={{flexGrow: 1}} className={`step1 step6 ${classes.menuList}`}>
          {application.config.accordions.map((accordion, index) => {
            return (
              accordion.show &&
              <ExpansionPanel
                key={index}
                className={`${classes.expansionPanel}`}
                expanded={expandedPanel === `panel${index}`}
                onChange={handleExpansionPanel(`panel${index}`)}
                data-position='right'
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{accordion.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                  {renderAccordion(accordion)}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )
          })}
        </div>
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
      </div>
    )
  }
}

MenuAccordion = withStyles(styles, { withTheme: true })(MenuAccordion)
export default connect(state => state)(MenuAccordion)
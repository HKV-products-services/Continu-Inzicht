import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import asyncActions from '../../state/async-actions'
import * as actions from '../../state/actions'
const { LOADING_STATE, SET_REPORT_FROM, SET_REPORT_TO } = actions

import Button from '@material-ui/core/Button'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { exportJsonToCSV } from '../../lib/utils'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import 'moment/locale/nl'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  container: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
  },
  datePicker: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  formControl: {
    display: 'inline-block',
    margin: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px 0`,
    '&:last-of-type': {
      margin: 0
    }
  },
  textField: {
    width: '100%'
  },
  button: {
    margin: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px 0`,
    '&:last-of-type': {
      margin: `0 0 ${theme.spacing(1)}px 0`
    }
  }
})

class ReportsMenu extends React.Component {
  constructor(props) {
    super(props)
    const to = new Date(Date.now())
    let from = new Date(Date.now())
    from.setHours(0, 0, 0, 0)
    this.state = {
      from: from.getTime(),
      to: to.getTime()
    }
    this.props.dispatch({ type: SET_REPORT_FROM, from: from.getTime() })
    this.props.dispatch({ type: SET_REPORT_TO, to: to.getTime() })
  }

  exportToCSV = () => {
    const { logs } = this.props.database
    exportJsonToCSV(logs, "export_log.csv")
  }

  handleDateChange = name => date => {
    const value = date.toDate()
    const { appid } = this.props
    let { logtype, from, to } = this.props.database
    if (value) {
      if (name === 'from') {
        from = new Date(value).getTime()
        this.setState({ from: from })
        this.props.dispatch({ type: SET_REPORT_FROM, from: from })
      }
      else if (name === 'to') {
        to = new Date(value).getTime()
        this.setState({ to: to })
        this.props.dispatch({ type: SET_REPORT_TO, to: to })
      }
      if (logtype) {
        this.props.dispatch({ type: LOADING_STATE, loading: true })
        this.props.dispatch(asyncActions.getLog(process.env.webserver, appid, logtype, from, to))
        this.props.dispatch({ type: LOADING_STATE, loading: false })
      }
    }
  }

  render() {
    const { classes } = this.props
    const { from, to } = this.state
    const fromDate = new Date(from)
    const toDate = new Date(to)
    moment.locale("nl")
    return (
      <div className={classes.container}>
        <Typography paragraph variant="h5">Zorgplicht</Typography>
        <Typography paragraph variant="body1" style={{ lineHeight: 1 }}>In het kader van zorgplicht kunt u hier specifieke rapportages opvragen.</Typography>
        <Typography paragraph variant="body1" style={{ lineHeight: 1 }}>Selecteer eerst een periode.</Typography>
        <Typography paragraph variant="body1" style={{ lineHeight: 1 }}>Kies vervolgens de gewenste data en exporteer de rapportage.</Typography>
        <Typography variant="body2">Datum</Typography>
        <div className={classes.datePicker}>
          <MuiPickersUtilsProvider utils={MomentUtils} locale={'nl'} moment={moment}>
            <DatePicker
              className={classes.formControl}
              format="LL"
              id="from"
              label="Van"
              onChange={this.handleDateChange('from')}
              value={fromDate}
            />
            <DatePicker
              className={classes.formControl}
              format="LL"
              id="to"
              label="Tot"
              onChange={this.handleDateChange('to')}
              value={toDate}
            />
          </MuiPickersUtilsProvider>
        </div>
        <Button disabled variant="contained" className={classes.button} color="primary">Genereer data</Button>
        <Button variant="contained" className={classes.button} color="primary" onClick={this.exportToCSV}>Exporteer data</Button>
      </div>
    )
  }
}

ReportsMenu = withStyles(styles, { withTheme: true })(ReportsMenu)
export default connect(state => state)(ReportsMenu)
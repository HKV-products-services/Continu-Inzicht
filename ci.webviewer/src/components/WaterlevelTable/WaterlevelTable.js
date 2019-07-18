import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { localDateTimeLong, roundValue } from '../../lib/utils'

const styles = theme => ({
  root: {
    width: '100%',
    margin: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    overflow: 'auto'
  },
  button: {
    fontSize: theme.typography.pxToRem(18),
    verticalAlign: 'middle',
    cursor: 'pointer'
  },
  formControl: {
    verticalAlign: 'unset'
  },
  select: {
    fontSize: 'inherit'
  },
  label: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2)
  },
  tableHead: {
    position: 'sticky',
    color: theme.palette.grey[200],
    boxShadow: '1px 0 0 1px rgba(224, 224, 224, 1)',
    top: 0,
    zIndex: 1
  },
  predicted: {
    backgroundColor: 'rgba(178, 255, 178, 0.5)'
  }
})

class WaterlevelTable extends React.Component {

  render() {
    const { application, classes, database, moment } = this.props
    const { station } = this.props.database
    if (!station.waterlevel) return null
    let parameterName = ''
    let parameterUnit = ''
    if (station.waterlevel.length > 0){
      parameterName = station.waterlevel[0].parametername
      parameterUnit = station.waterlevel[0].parameterunit
    }
    return (
      <Paper className={ classes.root }>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center' padding='checkbox' className={ classes.tableHead }>Datum en tijd</TableCell>
              <TableCell align='center' padding='checkbox' className={ classes.tableHead }>{parameterName} [{parameterUnit}]</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {station.waterlevel.map((station, index) => (
              <TableRow key={index} className={station.datetime > database.appinfo.moments[1].datetime ? classes.predicted : null}>
                <TableCell align='center' padding='checkbox'>{ localDateTimeLong(application.config.locale, station.datetime) }</TableCell>
                <TableCell align='center' padding='checkbox'>{ roundValue(station.value, 2) }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

WaterlevelTable = withStyles(styles, { withTheme: true })(WaterlevelTable)
export default connect(state => state)(WaterlevelTable)
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import { localDateTime, msToTime } from '../../lib/utils'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const rows = [
  { id: 'name', label: 'Locatie', align: 'left' },
  { id: 'datetime', label: 'Datum', align: 'left' },
  { id: 'periodlength', label: 'Duur', align: 'left' },
  { id: 'statebefore', label: 'Van', align: 'left' },
  { id: 'stateafter', label: 'Naar', align: 'left' }
]

const headerStyle = theme => ({
  tableHead: {
    position: 'fixed',
    display: 'inline-block',
    width: '100%',
    maxWidth: 960
  },
  tableRow: {
    display: 'inline-flex',
    width: '100%',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    marginTop: 0
  },
  tableCell: {
    color: theme.palette.grey[200],
    borderBottom: 'none',
    '&::before': {
      content: '" "',
      display: 'inline-block',
      height: '100%',
      verticalAlign: 'middle'
    }
  }
})

class ReportsTableHead extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <TableHead className={classes.tableHead}>
        <TableRow className={classes.tableRow}>
          {rows.map(row => {
            return (
              <TableCell
                className={classes.tableCell}
                key={row.id}
              >
                {row.label}
              </TableCell>
            )
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}
  
ReportsTableHead = withStyles(headerStyle, { withTheme: true })(ReportsTableHead)

const styles = theme => ({
  root: {
    width: '100%',
    height: 'calc(100% - 64px)',
    position: 'relative',
    overflowX: 'auto'
  },
  header: {
    display: 'flex',
    position: 'fixed',
    width: 'calc(100% - 16px)',
    padding: theme.spacing(1),
    borderTop: '1px solid rgba(224, 224, 224, 1)',
    background: 'white',
    overflow: 'hidden'
  },
  content: {
    height: 'calc(100% - 50px)'
  },
  table: {
    height: '100%',
    display: 'block'
  },
  tableBody: {
    display: 'inline-block',
    width: '100%',
    height: 'calc(100% - 56px)',
    marginTop: '56px',
    overflow: 'auto'
  },
  tableRow: {
    display: 'inline-flex',
    width: '100%'
  },
  tableCell: {
    width: '100%',
    display: 'grid',
    '&::before': {
      content: '" "',
      display: 'inline-block'
    }
  },
  button: {
    flexShrink: 0,
    margin: `0 ${theme.spacing(1)}px`,
    '&:last-of-type': {
      marginRight: 0
    }
  },
  title: {
    lineHeight: 1.5,
  },
  label: {
    flexShrink: 0,
    lineHeight: 2.2,
    margin: `0 ${theme.spacing(2)}px`,
  }
})

class ReportsTable extends React.Component {
  render() {
    const { classes, database, application } = this.props
    if (!database.logs) return null
    return (
      <div role="document" className={classes.root}>
        <Table className={classes.table}>
          <ReportsTableHead />
          <TableBody className={classes.tableBody}>
            {database.logs.map((log, index) => (
              <TableRow
                className={classes.tableRow}
                tabIndex={-1}
                key={index}
              >
                <TableCell align='left' className={classes.tableCell}>{log.name}</TableCell>
                <TableCell align='left' className={classes.tableCell}>{localDateTime(application.config.locale, log.datetime)}</TableCell>
                <TableCell align='left' className={classes.tableCell}>{msToTime(log.periodlength)}</TableCell>
                <TableCell align='left' className={classes.tableCell}>{log.statebefore}</TableCell>
                <TableCell align='left' className={classes.tableCell}>{log.stateafter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

ReportsTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

ReportsTable = withStyles(styles, { withTheme: true })(ReportsTable)
export default connect(state => state)(ReportsTable)
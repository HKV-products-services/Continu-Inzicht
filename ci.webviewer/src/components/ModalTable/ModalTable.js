import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(1),
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
    background: theme.palette.primary.main,
    color: theme.palette.grey[50],
    fontSize: theme.typography.pxToRem(16),
    width: '50%'
  },
  tableRow: {
    display: 'flex',
    height: 'unset'
  },
  tableCell: {
    width: '25%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    flexGrow: 1,
    '&:last-of-type': {
      borderRight: 0
    }
  },
  percentageBox: {
    textAlign: 'center',
    marginRight: theme.spacing(1),
    borderRadius: 4,
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    fontWeight: 500
  }
})

class ModalTable extends React.Component {

  handleTemp = (p, index, e) => {
    const { analyseParameters } = this.props
    analyseParameters[index][p] = e.target.value
    console.log('analyseParameters', analyseParameters)
  }

  renderTextField = (value, p, index) => {
    return <TextField
      fullWidth
      defaultValue={value}
      onChange={(e) => this.handleTemp(p, index, e)}
      variant='outlined'
      InputProps={{
        className: 'textFieldOutlined'
      }}
    />
  }

  calculatePercentage = (input, max, decimal) => {
    const percentage = ((input / max) * 100).toFixed(decimal)
    return `${percentage}%`
  }

  renderAnalyseParameters = () => {
    const { analyseParameters, classes } = this.props
    if (analyseParameters) {
      return analyseParameters.map((parameter, index) => (
        <TableRow key={index} className={classes.tableRow}>
          {Object.keys(parameter).map((p, i) => (
            <TableCell key={i} className={classes.tableCell}>
              {this.renderTextField(parameter[p], p, index)}
            </TableCell>
          ))}
        </TableRow>
      ))
    }
  }

  render() {
    const { classes, database } = this.props
    const results = database.settings.results
    // const allowed = ['costs', 'bates', 'ratio']
    const allowed = ['ratio']
    const filtered = Object.keys(results)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = results[key];
        return obj;
      }, {});
    let withMeasure = []
    database.settings.basicSafety.forEach(safety => {
      withMeasure.push(safety.withMeasure)
    })
    let withoutMeasure = []
    database.settings.basicSafety.forEach(safety => {
      withoutMeasure.push(safety.withoutMeasure)
    })
    const totalLength = withMeasure.reduce(function(a, b) { return a + b }, 0)
    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableHead}>Criterium</TableCell>
              <TableCell className={classes.tableHead}>Waarde</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(filtered).map((row, index) => (
              <TableRow key={index} className={classes.tableRow}>
                <TableCell className={classes.tableCell} style={{borderBottom: (index + 1) === allowed.length ? '1px solid rgba(224, 224, 224, 1)' : 0}}>{index === 0 && 'MKBA'}</TableCell>
                <TableCell className={classes.tableCell}>{results[row].name}: {results[row].value} {results[row].unit}</TableCell>
              </TableRow>
            ))}
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableCell}>Basisveiligheid met maatregel</TableCell>
              <TableCell className={classes.tableCell} style={{overflow: 'auto'}}>{withMeasure.map((val, index) => (<div key={index} className={classes.percentageBox} style={{background: database.settings.basicSafety[index].color}}>{this.calculatePercentage(val, totalLength, 0)}</div>))}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableCell}>Basisveiligheid zonder maatregel</TableCell>
              <TableCell className={classes.tableCell} style={{overflow: 'auto'}}>{withoutMeasure.map((val, index) => (<div key={index} className={classes.percentageBox} style={{background: database.settings.basicSafety[index].color}}>{this.calculatePercentage(val, totalLength, 0)}</div>))}</TableCell>
            </TableRow>
            {this.renderAnalyseParameters()}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

ModalTable = withStyles(styles, { withTheme: true })(ModalTable)
export default connect(state => state)(ModalTable)
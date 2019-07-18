import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import * as actions from '../../state/actions'

import CloseIcon from '@material-ui/icons/Close'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import { roundValue } from '../../lib'

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const rows = [
  { id: 'name', label: 'Dijkvak'},
  { id: 'failureprobability', label: 'Faalkans [%]', align: 'right'},
  { id: 'successrate', label: 'Slagingskans', align: 'right'},
  { id: 'measure', label: 'Maatregel'}
]

const headerStyle = theme => ({
  tableCell: {
    position: 'sticky',
    color: theme.palette.grey[200],
    boxShadow: '1px 0 0 1px rgba(224, 224, 224, 1)',
    padding: `0 12px`,
    top: 0,
    zIndex: 1,
    '&:last-child': {
      padding: `0 12px`,
    }
  },
  tableSortLabel: {
    '&:hover': {
      color: 'inherit'
    },
    '&:focus': {
      color: 'inherit'
    }
  },
  icon: {
    fill: '#eeeeee'
  },
  active: {
    color: 'white !important'
  }
})

class MeasureTableHead extends React.Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { classes, order, orderBy } = this.props
    return (
      <TableHead>
        <TableRow>
          {rows.map((row, index) => {
            return (
              <TableCell
                key={index}
                className={classes.tableCell}
                sortDirection={orderBy === row.id ? order : false}
                align={row.align ? row.align : 'left'}
              >
                <TableSortLabel
                  active={orderBy === row.id}
                  classes={{icon: classes.icon, active: classes.active}}
                  className={classes.tableSortLabel}
                  direction={order}
                  onClick={this.createSortHandler(row.id)}
                >
                  {row.label}
                </TableSortLabel>
              </TableCell>
            )
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}

MeasureTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
}

MeasureTableHead = withStyles(headerStyle, { withTheme: true })(MeasureTableHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(0.5),
    overflowX: 'auto'
  },
  button: {
    fontSize: theme.typography.pxToRem(20),
    verticalAlign: 'middle',
    cursor: 'pointer',
    margin: `6px ${theme.spacing(2)}px 6px 0`
  },
  formControl: {
    textAlign: 'left',
    width: 'calc(100% - 40px)',
  },
  select: {
    fontSize: 'inherit'
  }
})

class MeasureTable extends React.Component {

  state = {
    order: 'asc',
    orderBy: '',
    measures: []
  }

  componentDidUpdate(prevProps) {
    if (this.props.database.section !== prevProps.database.section) {
      const { section } = this.props.database
      const { moments } = this.props.database.appinfo
      const datetime = moments[this.props.moment.index].datetime
      const sectionMoment = section.filter(section => section.datetime === datetime && section.measureid >= 1 )
      this.setStates(sectionMoment)
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({ order, orderBy })
  }

  handleChange = (event, sectionId) => {
    const { database, onChange } = this.props
    const { measures } = this.state
    const section = database.section.find(e => e.sectionid == sectionId)
    const measure = database.appinfo.measures.find(e => e.id == event.target.value)
    measures[sectionId] = [event.target.value, section.successrate]

    this.setState({measures: measures}, () => {
      onChange(measures)
    })
    this.props.dispatch({type: actions.SET_FEATURE_ID, id: sectionId})
    this.props.dispatch({type: actions.SET_FEATURE_NAME, name: section.name})
    this.props.dispatch({type: actions.SET_MEASURE_ID, measure: measure.id})
    this.props.dispatch({type: actions.SET_MEASURE_NAME, measure: measure.name})
    this.props.dispatch({type: actions.MEASURES_VAL_DIALOG_STATE, open: true})
    switch (event.target.value) {
      case 0:
        return (
          this.props.dispatch({type: actions.MEASURES_VAL_DIALOG_STATE, open: false}),
          this.props.dispatch({type: actions.SET_MEASURE_PARAMETER, measure: 1}),
          measures[sectionId] = [event.target.value, 1.0],
          this.setState({measures: measures})
        )
      default:
        return (
          this.props.dispatch({type: actions.MEASURES_VAL_DIALOG_STATE, open: true})
      )
    }
  }

  handleReset = (sectionId) => {
    const { onChange } = this.props
    const { measures } = this.state
    measures[sectionId] = null
    
    this.setState({measures: measures}, () => {
      onChange(measures)
    })
  }

  setStates = (sectionMoment) => {
    const measures = {}
    sectionMoment.forEach(section => {
      measures[section.sectionid] = section.measureid !== null ? [section.measureid, section.successrate] : 0
    })
    this.setState({measures: measures})
  }

  setMeasureInState = measures => {
    const { database, onChange } = this.props
    const datetime = database.appinfo.moments[this.props.moment.index].datetime
    const sectionMoment = database.section.filter(section => section.datetime === datetime && section.measureid >= 1 )

    sectionMoment.forEach(section => {
      measures[section.sectionid] = section.measureid !== null ? [section.measureid, section.successrate] : 0
    })
    this.setState({measures: measures}, () => {
      onChange(measures)
    })
  }

   render() {
    const { classes, database, onMouseOut, onMouseOver, overlays } = this.props
    const { measures, order, orderBy } = this.state
    const datetime = database.appinfo.moments[this.props.moment.index].datetime
    if (!database.section[0]) return null
    const sectionMoment = database.section.filter(section => section.datetime === datetime)
    let selected = overlays.selected
    return (
      <Paper className={classes.root}>
        <Table>
          <MeasureTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
          />
          <TableBody>
            {stableSort(sectionMoment, getSorting(order, orderBy)).map((section, index) => (
              <TableRow
                hover
                key={index}
                selected={section.sectionid === selected}
                onMouseOver={() => onMouseOver(section)}
                onMouseOut={() => onMouseOut()}
                id={section.sectionid}
              >
                <TableCell>{section.name}</TableCell>
                <TableCell align='right'>{roundValue(section.failureprobability * 100, 2)}</TableCell>
                <TableCell align='right'>
                  {measures[section.sectionid] == undefined ? Number(1).toFixed(2) : Number(measures[section.sectionid][1]).toFixed(2)}
                </TableCell>
                <TableCell>
                  {
                    measures[section.sectionid] == undefined || measures[section.sectionid] == 0 
                    ? <CloseIcon color="disabled" className={`${classes.button} ${classes.disabled}`}/>
                    : <CloseIcon color="primary" className={classes.button} onClick={() => this.handleReset(section.sectionid)}/>
                  }
                  <FormControl className={classes.formControl}>
                    <Select
                      className={classes.select}
                      name={section.measure.toString()}
                      value={measures[section.sectionid] == undefined ? 0 : measures[section.sectionid][0]}
                      onChange={(e) => this.handleChange(e, section.sectionid)}
                    >
                      {database.appinfo.measures.map((measure, index) => (
                        <MenuItem key={index} value={measure.id}>{measure.description}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

MeasureTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

MeasureTable = withStyles(styles, { withTheme: true })(MeasureTable)
export default connect(state => state)(MeasureTable)
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

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
import TextField from '@material-ui/core/TextField'

import { roundValue } from '../../lib/utils'

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
  { id: 'name', label: 'Vak'},
  { id: 'failureprobability', label: 'Faalkans [%]', align: 'right'},
  { id: 'expertjudgement', label: 'Beheerdersoordeel'},
  { id: 'expertjudgementrate', label: 'Beheerdersoordeel faalkans'}
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

class AdministratorTableHead extends React.Component {
  
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

AdministratorTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
}

AdministratorTableHead = withStyles(headerStyle, { withTheme: true })(AdministratorTableHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(0.5),
    overflowX: 'auto'
  },
  button: {
    fontSize: theme.typography.pxToRem(18),
    verticalAlign: 'middle',
    cursor: 'pointer',
    margin: `6px ${theme.spacing(2)}px 6px 0`
  },
  disabled: {
    cursor: 'auto'
  },
  formControl: {
    textAlign: 'left',
    width: 'calc(100% - 40px)',
    minWidth: 185
  },
  formControlLabel: {
    transform: 'translate(10px, 5px) scale(0.7)',
    transformOrigin: 'center',
    textAlign: 'right',
    minWidth: '-webkit-fill-available'
  },
  select: {
    fontSize: 'inherit'
  },
  input: {
    fontSize: 'inherit',
    marginTop: '0 !important'
  }
})

class AdministratorTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: '',
      expertjudgements: [{
        id: null,
        faalkans: null
      }]
    }
  }

  componentDidMount = () => {
    const { database, moment } = this.props
    const datetime = database.appinfo.moments[moment.index].datetime
    const sectionMoment = database.section.filter(section => section.datetime === datetime && section.expertjudgementid > 0 )
    this.setStates(sectionMoment)
    // voor firefox kun je type=number decimals overschrijven maar niet in chrome
    Array.from(document.getElementsByClassName('expertRate')).map(e => {
      e.setAttribute("lang", "en-EN")
    })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({ order, orderBy })
  }

  handleChange = (event, sectionid) => {
    const { database, onChange } = this.props
    const { expertjudgements } = this.state
    let faalkans = null
    if (event.target.value === 0) {
      faalkans = 0
    } else {
      faalkans = roundValue(database.conditions[event.target.value - 1].statevalue * 100, 2)
    }
    expertjudgements[sectionid] = { id: event.target.value, faalkans: faalkans }
    this.setState({expertjudgements: expertjudgements}, () => {
      onChange(expertjudgements)
    })
  }

  handleChangeF = (event, sectionid, value, min, max) => {
    const { disableApply, onChange } = this.props
    const { expertjudgements } = this.state
    const f = event.target.value
    if (f > max || f < min) {
      disableApply(true)
    } else {
      disableApply(false)
    }
    expertjudgements[sectionid] = {id: value, faalkans: f}
    this.setState({expertjudgements: expertjudgements}, () => {
      onChange(expertjudgements)
    })
  }

  handleReset = (sectionid) => {
    const { expertjudgements } = this.state
    const { onChange } = this.props
    expertjudgements[sectionid] = null
    this.setState({expertjudgements: expertjudgements}, () => {
      onChange(expertjudgements)
    })
  }

  setStates = (sectionMoment) => {
    const { views } = this.props
    const expertjudgements = {}
    sectionMoment.forEach(section => {
      if (views.active === 'gebieden') {
        expertjudgements[section.areaid] = section.expertjudgementid !== null
        ? { id: section.expertjudgementid, faalkans: roundValue(section.failureprobability * 100, 2) }
        : { id: 0, faalkans: 0 }
      } else {
        expertjudgements[section.sectionid] = section.expertjudgementid !== null
        ? { id: section.expertjudgementid, faalkans: roundValue(section.failureprobability * 100, 2) }
        : { id: 0, faalkans: 0 }
      }
    })
    this.setState({
      expertjudgements: expertjudgements
    })
  }

  defineStepSize = (id) => {
    switch(id) {
      case 1:
        return 0.01
      case 2:
        return 0.1
      case 3:
      case 4:
      default:
        return 1
    }
  }

  render() {
    const { area, classes, database, moment, onClick, onMouseOut, onMouseOver, overlays, views } = this.props
    const { datetime } = database.appinfo.moments[moment.index]
    const { expertjudgements, order, orderBy } = this.state
    let sectionMoment = null
    let parameter = null
    // console.log('views', views.active)
    // if (views.active === 'gebieden') {
    //   parameter = database.appinfo.parameters.find(parameter => parameter.code === area.risico)
    //   sectionMoment = database.section.filter(section => section.datetime === datetime && section.parameterid === parameter.id)
    // } else {
    //   sectionMoment = database.section.filter(section => section.datetime === datetime)
    // }
    if (!database.section) return null
    sectionMoment = database.section.filter(section => section.datetime === datetime)
    let selected = overlays.selected
    return (
      <Paper className={classes.root}>
        <Table>
          <AdministratorTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
          />
          <TableBody>
            {stableSort(sectionMoment, getSorting(order, orderBy)).map((section, index) => {
              let sectionid = null
              views.active === 'gebieden' ? sectionid = section.areaid : sectionid = section.sectionid
              const rate = expertjudgements[sectionid] == undefined || expertjudgements[sectionid] && expertjudgements[sectionid].id == 0 ? 0 : expertjudgements[sectionid]
              let min = database.conditions[rate == undefined || rate == 0 || rate.id == 0 ? 0 : rate.id - 1].lowerboundary * 100
              let max = database.conditions[rate == undefined || rate == 0 || rate.id == 0 ? 0 : rate.id - 1].upperboundary * 100
              let error = rate.faalkans > max || rate.faalkans < min ? true : false
              return (
                <TableRow
                  hover
                  selected={views.active === 'gebieden' ? section.areaid === selected : section.sectionid === selected}
                  key={index}
                  onMouseOver={() => onMouseOver(section)}
                  onMouseOut={() => onMouseOut()}
                  onClick={() => onClick(section)}
                  id={sectionid}
                >
                  <TableCell>{section.name}</TableCell>
                  <TableCell align='right'>{roundValue(section.failureprobability * 100, 2)}</TableCell>
                  <TableCell>
                    {
                      expertjudgements[sectionid] == undefined || expertjudgements[sectionid].id == 0 
                      ? <CloseIcon color="disabled" className={`${classes.button} ${classes.disabled}`}/>
                      : <CloseIcon color="primary" className={classes.button} onClick={() => this.handleReset(sectionid)}/>
                    }
                    <FormControl className={classes.formControl}>
                      <Select
                        className={classes.select}
                        name={section.name.toString()}
                        // value={section.expertjudgementid === undefined ? 0 : section.expertjudgementid}
                        value={expertjudgements[sectionid] == undefined ? 0 : expertjudgements[sectionid].id}
                        onChange={(e) => this.handleChange(e, sectionid)}
                      >
                        <MenuItem value={0}>{'Geen beheerdersoordeel'}</MenuItem>
                        {database.conditions.map((condition, index) => (
                          <MenuItem key={index} value={condition.stateid}>{condition.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      className={classes.formControl}
                      error={error}
                      label={rate == undefined || rate == 0 ? null : `min: ${roundValue(min, 2)}, max: ${roundValue(max, 2)}`}
                      value={rate == undefined || rate == 0 ? 0 : rate.faalkans}
                      disabled={rate == undefined || rate == 0 || rate.id == 0}
                      onChange={(e) => this.handleChangeF(e, sectionid, rate.id, min, max)}
                      InputLabelProps={{className: classes.formControlLabel}}
                      InputProps={{
                        className: `${classes.input} expertRate`,
                        inputProps: {step: this.defineStepSize(rate.id)}
                      }}
                      type="number"
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

AdministratorTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

AdministratorTable = withStyles(styles, { withTheme: true })(AdministratorTable)
export default connect(state => state)(AdministratorTable)
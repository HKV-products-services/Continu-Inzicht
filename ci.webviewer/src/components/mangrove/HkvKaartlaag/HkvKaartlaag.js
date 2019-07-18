import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
})

class HkvKaartlaag extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
  }

  render() {
    const { classes, layer } = this.props
    return (
      <React.Fragment>
        <Checkbox />
        <Typography variant="h6" gutterBottom>{layer.name}</Typography>
        {layer.subtitle && <Typography variant="subtitle2" gutterBottom>layer.subtitle</Typography>}
      </React.Fragment>
    )
  }
}

HkvKaartlaag = withStyles(styles, { withTheme: true })(HkvKaartlaag)
export default connect(state => state)(HkvKaartlaag)
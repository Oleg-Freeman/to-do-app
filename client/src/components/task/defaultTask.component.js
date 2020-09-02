import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

// Redux
import { connect } from 'react-redux';

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class DefaultTask extends Component {
  render() {
    const {
      classes
    } = this.props;

    return (
      <Card className={classes.card}>
      <Checkbox
      value="CheckBox"
      color="primary"
      />
      <CardContent className={classes.content}>
        <Typography variant="body1">Add your first task! Just press "+" button</Typography>
      </CardContent>
    </Card>
    );
  }
}
DefaultTask.propTypes = {
  card: PropTypes.string,
  content: PropTypes.string,
  classes: PropTypes.object.isRequired
};


export default connect()(withStyles(styles)(DefaultTask));

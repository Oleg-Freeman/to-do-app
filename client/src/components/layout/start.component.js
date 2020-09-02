import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// MUI stuff
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
  buttons: {
    textAlign: 'center',
    '& a': {
      margin: '20px 10px'
    }
  }
});

class Start extends Component {

  render() {
    const { classes, loading } = this.props;

    const profileMarkup = !loading ? (
      <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            Set up your own To - Do list
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/register"
            >
              Get Started
            </Button>
          </div>
        </Paper>
    ) : (
      <div>Loading...</div>
    );

    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  data: state.data
});

Start.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps
)(withStyles(styles)(Start));

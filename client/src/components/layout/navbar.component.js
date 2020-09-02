import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import NewTask from '../task/AddTask';
import LogOutButton from '../user/logOutButton'

// Redux Stuff
import { connect } from 'react-redux';

// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// Icons
import HomeIcon from '@material-ui/icons/Home';

class Navbar extends Component {
  render() {
    return (
      <AppBar position="fixed">
        <Toolbar className="nav-container">
          {window.localStorage.getItem('token') ? (
            <Fragment>
              <NewTask />
              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon />
                </MyButton>
              </Link>
              <LogOutButton/>
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="login">Login</Button>
              <Button color="inherit" component={Link} to="register">Register</Button>
            </Fragment>
          )}

        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});
 
export default connect(mapStateToProps)(Navbar);

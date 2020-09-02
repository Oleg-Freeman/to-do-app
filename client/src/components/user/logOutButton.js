import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom"
// Icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// REdux
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/userActions';

export class LogOutButton extends Component {
  constructor() {
    super();

    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleLogOut() {
    this.props.logoutUser();
    return <Redirect to="/"/>
  }

  render() {
    const isAuthenticated = window.localStorage.getItem('token');
    const logOutButton = isAuthenticated ? (
      <MyButton onClick={this.handleLogOut} tip="Log Out">
        <ExitToAppIcon color="primary" />
      </MyButton>
    ) : null;
    return logOutButton;
  }
}

LogOutButton.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  logoutUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(LogOutButton);

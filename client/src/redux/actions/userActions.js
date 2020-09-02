import {
  SET_USER,
  SET_USERS,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  LOADING_USER
} from '../types';
import axios from 'axios';
const baseURL = '/';

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post(`${baseURL}users/login`, userData)
    .then(res => {
      if (res.data.authenticated) {
        dispatch({ type: CLEAR_ERRORS });
        // dispatch({ type: SET_AUTHENTICATED });
        history.push('/');
        window.location.reload();
      }
      else {
        dispatch({ type: CLEAR_ERRORS });
        window.localStorage.setItem('token', JSON.stringify(res.data.token)); // JSON.stringify(res.data._id)
        window.localStorage.setItem('currentUserId', JSON.stringify(res.data.userId));
        window.localStorage.setItem('isAdmin', JSON.stringify(res.data.isAdmin));
        // dispatch({ type: SET_AUTHENTICATED });
        dispatch({
          type: SET_USER,
          payload: res.data
        });
        history.push('/');
        window.location.reload();
      }
    }).catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const registerUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post(`${baseURL}users/register`, newUserData)
    .then((res) => {
      dispatch({ type: CLEAR_ERRORS });
      history.push('/login');
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = (history) => () => {
  const currentUserId = window.localStorage.getItem('currentUserId');
  axios.get(`${baseURL}users/logout/${currentUserId.replace(/['"]+/g, '')}`)
    .then(res => {
      if (res.data.notAuthenticated) {
        window.localStorage.removeItem('currentUserId');
        window.localStorage.removeItem('token');
        history.push('/login');
      }
      if (res.data.loggedOut) {
      // dispatch({ type: SET_UNAUTHENTICATED });
        window.localStorage.removeItem('currentUserId');
        window.localStorage.removeItem('token');
        window.location.reload();
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const getUserData = (userId) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  if (userId) {
    axios
      .get(`${baseURL}users/${userId.replace(/['"]+/g, '')}`)
      .then((res) => {
        dispatch({
          type: SET_USER,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  }
  else {
    dispatch({
      type: SET_USER,
      payload: ''
    });
  }
};

// Get all users
export const getAllUsers = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
      .get(`${baseURL}users/`)
      .then((res) => {
        dispatch({
          type: SET_USERS,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
};




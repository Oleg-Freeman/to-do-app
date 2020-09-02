import {
  SET_TASKS,
  LOADING_DATA,
  DELETE_TASK,
  SET_ERRORS,
  ADD_TASK,
  EDIT_TASK,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_TASK,
  STOP_LOADING_UI,
  MARK_COMPLETE
} from '../types';
import axios from 'axios';
const baseURL = '/'; 
const token = window.localStorage.getItem('token');
const isAdmin = window.localStorage.getItem('isAdmin');

// Get all tasks
export const getTasks = () => (dispatch) => {
  
  if (token) {
    dispatch({ type: LOADING_DATA });
    axios({
      method: 'get',
      url: `${baseURL}tasks`,
      headers: { token: token.replace(/['"]+/g, '') }
    })
      .then((res) => {
        dispatch({
          type: SET_TASKS,
          payload: res.data
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_TASKS,
          payload: []
        });
        console.log(err);
      });
  }
  
};

// ADMIN - Get all tasks
export const adminGetTasks = () => (dispatch) => {
  
  if (token && isAdmin === 'true') {
    dispatch({ type: LOADING_DATA });
    axios({
      method: 'get',
      url: `${baseURL}tasks/admin`,
      headers: { token: token.replace(/['"]+/g, '') }
    })
      .then((res) => {
        dispatch({
          type: SET_TASKS,
          payload: res.data
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_TASKS,
          payload: []
        });
        console.log(err);
      });
  }
  
};

// Get one task
export const getTask = (taskId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`${baseURL}tasks/${taskId}`)
    .then((res) => {
      dispatch({
        type: SET_TASK,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};
  // Add task
export const addTask = (newTask) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  // const token = window.localStorage.getItem('token');
  axios({
    method: 'post',
    url: `${baseURL}tasks/add/`,
    data: newTask,
    headers: { token: token.replace(/['"]+/g, '') }
  })
    .then((res) => {
      dispatch({
        type: ADD_TASK,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

  // Edit task
  export const editTask = (newTask, taskId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    // const token = window.localStorage.getItem('token');
    axios({
      method: 'post',
      url: `${baseURL}tasks/update/${taskId}`,
      data: newTask,
      headers: { token: token.replace(/['"]+/g, '') }
    })
      .then((res) => {
        dispatch({
          type: EDIT_TASK,
          payload: res.data
        });
        dispatch(clearErrors());
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
      });
  };

// Delete task
export const deleteTask = (taskId) => (dispatch) => {
  // const token = window.localStorage.getItem('token');
  axios({
    method: 'delete',
    url: `${baseURL}tasks/${taskId}`,
    headers: { token: token.replace(/['"]+/g, '') }
  })
    .then(() => {
      dispatch({ type: DELETE_TASK, payload: taskId });
    })
    .catch((err) => console.log(err));
};

// Mark Task as complete
export const markComplete = (taskId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios({
    method: 'get',
    url: `${baseURL}tasks/complete/${taskId}`,
    headers: { token: token.replace(/['"]+/g, '') }
  })
    .then((res) => {
      dispatch({
        type: MARK_COMPLETE,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

export const getUserData = (userId) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`${baseURL}users/${userId.replace(/['"]+/g, '')}`)
    .then((res) => {
      dispatch({
        type: SET_TASKS,
        payload: res.data.tasks
      });
    })
    .catch(() => {
      dispatch({
        type: SET_TASKS
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

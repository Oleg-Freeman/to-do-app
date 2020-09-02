import {
  SET_USER
} from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  users: [],
  userId: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        credentials: { ...action.payload }
      };
    default:
      return state;
  }
}

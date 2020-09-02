import {
  SET_USER,
  SET_USERS,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER
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
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        credentials: { ...action.payload }
      };
      case SET_USERS:
      return {
        authenticated: true,
        loading: false,
        users: [ ...action.payload ]
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

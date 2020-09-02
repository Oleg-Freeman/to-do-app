import {
  SET_TASK,
  LOADING_DATA,
  ADD_TASK,
  EDIT_TASK,
  SET_TASKS,
  DELETE_TASK,
  MARK_COMPLETE
} from '../types';

const initialState = {
  tasks: [],
  task: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_TASKS: {
      return {
        ...state,
        tasks: [...action.payload],
        loading: false
      };
    }
    case SET_TASK:
      return {
        ...state,
        task: action.payload
      };
    case DELETE_TASK: {
      const index = state.tasks.findIndex(
        (task) => task._id === action.payload
      );
      state.tasks.splice(index, 1);
      return {
        ...state
      };
    }
    case ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks]
      };
      case EDIT_TASK: {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        state.tasks[index].body = action.payload.body;
        state.task.body = action.payload.body;
        
        return {
          ...state,
          tasks: [...state.tasks],
          task: {
            ...state.task
          }
        }
      };
    case MARK_COMPLETE: {
      const index = state.tasks.findIndex(
        (task) => task._id === action.payload.taskId
      );
      state.tasks[index].completed = action.payload.completed;
      state.task.completed = action.payload.completed;
      return {
        ...state,
        task: {
          ...state.task
        }
      };
    }
    default: {
      return state;
    }
      
  }
}

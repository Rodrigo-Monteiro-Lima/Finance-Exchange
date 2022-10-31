import { LOG_IN } from '../actions';

const initialState = {
  email: '',
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case LOG_IN:
    return {
      email: action.user,
    };
  default:
    return state;
  }
};

export default userReducer;

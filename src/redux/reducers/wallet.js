import {
  REQUEST_API,
  FAILED_REQUEST,
  SUCCESS_REQUEST,
} from '../actions';

const initialState = {
  currencies: [],
  expenses: [],
  exchange: [],
  editor: false,
  idToEdit: 0,
  error: '',
  total: '0',
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
  case REQUEST_API:
    return { ...state, isFetching: true };
  case SUCCESS_REQUEST:
    return { ...state, currencies: action.data, isFetching: false };
  case FAILED_REQUEST:
    return { ...state, error: action.error, isFetching: false };
  default:
    return state;
  }
};

export default walletReducer;

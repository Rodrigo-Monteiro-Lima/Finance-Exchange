import {
  REQUEST_API,
  FAILED_REQUEST,
  SUCCESS_REQUEST,
  NEW_EXPENSE,
  DELETE_EXPENSE,
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
    return { ...state, currencies: action.data };
  case FAILED_REQUEST:
    return { ...state, error: action.error };
  case NEW_EXPENSE:
    return {
      ...state,
      expenses: [...state.expenses, action.expense],
      total: (Number(state.total)
      + Number(action.expense.value
        * action.expense.exchangeRates[action.expense.currency].ask))
        .toFixed(2),
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      total: Math.abs(Number(state.total)
        - Number(state.expenses[action.index].value
          * state.expenses[action.index]
            .exchangeRates[state.expenses[action.index].currency].ask))
        .toFixed(2),
      expenses: state.expenses.filter((_expense, index) => index !== action.index),
    };
  default:
    return state;
  }
};

export default walletReducer;

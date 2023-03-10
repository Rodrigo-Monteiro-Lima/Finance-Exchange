import {
  REQUEST_API,
  SUCCESS_REQUEST,
  NEW_EXPENSE,
  DELETE_EXPENSE,
  EDIT_EXPENSE,
  SAVE_EDIT,
} from '../actions';

const initialState = {
  currencies: [],
  expenses: [],
  exchange: [],
  editor: false,
  idToEdit: 0,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
  case REQUEST_API:
    return { ...state, isFetching: true };
  case SUCCESS_REQUEST:
    return { ...state, currencies: action.data };
  case NEW_EXPENSE:
    return {
      ...state,
      expenses: [...state.expenses, action.expense],
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.filter((_expense, index) => index !== action.index),
    };
  case EDIT_EXPENSE:
    return { ...state, idToEdit: action.id, editor: true };
  case SAVE_EDIT:
    return {
      ...state,
      expenses: state.expenses.map((expense, index) => {
        if (index === action.index) {
          return action.expense;
        }
        return expense;
      }),
      editor: false,
    };
  default:
    return state;
  }
};

export default walletReducer;

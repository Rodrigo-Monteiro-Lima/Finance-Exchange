import getCurrentCoinQuotation from '../../services/coinQuotationAPI';

export const LOG_IN = 'LOG_IN';
export const REQUEST_API = 'REQUEST_API';
export const SUCCESS_REQUEST = 'SUCCESS_REQUEST';
export const NEW_EXPENSE = 'NEW_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const EDIT_EXPENSE = 'EDIT_EXPENSE';
export const SAVE_EDIT = 'SAVE_EDIT';

export const login = (user) => ({
  type: LOG_IN,
  user,
});

const requestAPI = () => ({ type: REQUEST_API });

const successRequest = (data) => ({ type: SUCCESS_REQUEST, data });

export const addExpense = (expense) => ({
  type: NEW_EXPENSE,
  expense,
});

export const deleteExpense = (index) => ({ type: DELETE_EXPENSE, index });

export const editExpense = (id) => ({ type: EDIT_EXPENSE, id });

export const saveEditExpense = (expense, index) => ({ type: SAVE_EDIT, expense, index });

export const fetchAPI = () => async (dispatch) => {
  dispatch(requestAPI());
  const coinQuotation = await getCurrentCoinQuotation();
  const data = Object.keys(coinQuotation).filter((currency) => currency !== 'USDT');
  dispatch(successRequest(data));
};

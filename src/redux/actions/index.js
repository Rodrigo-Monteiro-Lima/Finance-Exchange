import getCurrentCoinQuotation from '../../services/coinQuotationAPI';

export const LOG_IN = 'LOG_IN';
export const REQUEST_API = 'REQUEST_API';
export const SUCCESS_REQUEST = 'SUCCESS_REQUEST';
export const FAILED_REQUEST = 'FAILED_REQUEST';

export const login = (user) => ({
  type: LOG_IN,
  user,
});

const requestAPI = () => ({ type: REQUEST_API });

const successRequest = (data) => ({ type: SUCCESS_REQUEST, data });

const failedRequest = (error) => ({ type: FAILED_REQUEST, error });

export const fetchAPI = () => async (dispatch) => {
  try {
    dispatch(requestAPI());
    const coinQuotation = await getCurrentCoinQuotation();
    const data = Object.keys(coinQuotation).filter((currency) => currency !== 'USDT');
    dispatch(successRequest(data));
  } catch (error) {
    dispatch(failedRequest(error));
  }
};

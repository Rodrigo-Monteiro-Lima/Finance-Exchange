import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import mockFetch from './helpers/mockFetch';
import mockData from './helpers/mockData';

const delBtn = () => screen.getAllByTestId('delete-btn');

describe('Startest Delete button', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockFetch);
  });
  afterEach(() => {
    global.fetch.mockClear();
  });
  it('Delete button tests', async () => {
    const initialState = {
      user: {
        email: 'alguem@gemail.com',
      },
      wallet: {
        currencies: [...Object.keys(mockData).filter((currency) => currency !== 'USDT')],
        expenses: [{
          id: 0,
          value: '11',
          currency: 'EUR',
          method: 'Dinheiro',
          tag: 'Lazer',
          description: 'Onze dol',
          exchangeRates: mockData,
        },
        {
          id: 1,
          value: '1',
          currency: 'USD',
          method: 'Cartão de crédito',
          tag: 'Lazer',
          description: 'um dólar',
          exchangeRates: mockData,
        }],
      },
    };
    const { store } = renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const rows = screen.getAllByRole('row');
    const td = rows.filter((_row, index) => index > 0);
    td.forEach((ele) => {
      console.log(ele.innerHTML.substr(-548, 537));
      expect(ele.innerHTML.substr(-548, 537)).toBe('<button type="button" data-testid="delete-btn" class="delete-button"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>');
    });
    const btns = delBtn();
    btns.forEach((btn) => {
      expect(btn).toHaveAttribute('data-testid', 'delete-btn');
    });
    const total = screen.getByTestId('total-field');
    expect(total).toHaveTextContent(`${(store.getState().wallet.expenses
      .reduce((acc, curr) => acc + (curr.value * curr
        .exchangeRates[curr.currency].ask), 0)).toFixed(2)}`);
    userEvent.click(btns[1]);
    expect(total).toHaveTextContent(`${(store.getState().wallet.expenses
      .reduce((acc, curr) => acc + (curr.value * curr
        .exchangeRates[curr.currency].ask), 0)).toFixed(2)}`);
    const newBtns = delBtn();
    expect(newBtns).toHaveLength(1);
    expect(store.getState().wallet.expenses).toHaveLength(1);
    expect(store.getState().wallet.expenses[0]).toEqual(initialState.wallet.expenses[0]);
    expect(store.getState().wallet.expenses)
      .not.toContain(initialState.wallet.expenses[1]);
  });
});

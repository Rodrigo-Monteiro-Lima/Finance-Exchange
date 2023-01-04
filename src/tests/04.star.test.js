import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import mockFetch from './helpers/mockFetch';

describe('Startest expense', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockFetch);
  });
  afterEach(() => {
    global.fetch.mockClear();
  });
  it(' add expense', async () => {
    const initialState = {
      user: {
        email: 'alguem@gemail.com',
      },
      // wallet: {
      //   total: '0',
      // },
    };
    const { store } = renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const total = await screen.findByTestId('total-field');
    expect(total).toHaveTextContent('0.00');
    const valueInput = screen.getByTestId('value-input');
    userEvent.type(valueInput, '5');
    const descriptionInput = screen.getByTestId('description-input');
    userEvent.type(descriptionInput, 'pão');
    const btn = screen.queryByRole('button', { name: 'Adicionar despesa' });
    expect(btn).toBeInTheDocument();
    userEvent.click(btn);
    const value = await screen.findByText('5.00');
    expect(value).toBeInTheDocument();
    const description = await screen.findByText('pão');
    expect(description).toBeInTheDocument();
    // const newDescriptionInput = await screen.findByTestId('description-input');
    // const newValueInput = screen.getByTestId('value-input');
    // expect(newValueInput).toHaveValue('');
    // expect(newDescriptionInput).toHaveValue('');
    const tag = screen.getByTestId('tag-input');
    expect(tag).toHaveValue('Alimentação');
    const currency = screen.getByTestId('currency-input');
    expect(currency).toHaveValue('USD');
    const method = screen.getByTestId('method-input');
    expect(method).toHaveValue('Dinheiro');
    const newTotal = await screen.findByTestId('total-field');
    expect(newTotal).toHaveTextContent(`${((store.getState().wallet.expenses[0].value)
      * (store.getState().wallet.expenses[0]
        .exchangeRates[store.getState().wallet.expenses[0].currency].ask)).toFixed(2)}`);
    expect(total).toHaveTextContent('23.77');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(store.getState().wallet.expenses).toHaveLength(1);
    expect(store.getState().wallet.expenses[0].id).toBe(0);
    userEvent.type(valueInput, '10');
    userEvent.type(descriptionInput, 'ifood');
    userEvent.click(btn);
    // const value2 = await screen.findByText('10.00');
    // expect(value2).toBeInTheDocument();
    // const description2 = await screen.findByText('ifood');
    // expect(description2).toBeInTheDocument();
    expect(store.getState().wallet.expenses).toHaveLength(2);
    expect(store.getState().wallet.expenses[1].id).toBe(1);
  });
});

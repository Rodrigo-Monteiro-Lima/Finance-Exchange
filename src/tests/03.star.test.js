import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import mockFetch from './helpers/mockFetch';
import mockData from './helpers/mockData';

describe('Startest WalletForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockFetch);
  });
  afterEach(() => {
    global.fetch.mockClear();
  });
  it('WalletForm tests', async () => {
    const initialState = {
      user: {
        email: 'email@test.com',
      },
    };
    const optionsArr = ['USD', 'CAD', 'EUR', 'GBP', 'ARS', 'BTC', 'LTC', 'JPY', 'CHF', 'AUD', 'CNY', 'ILS', 'ETH', 'XRP', 'DOGE', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
    const { store } = renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const value = await screen.findByTestId('value-input');
    expect(value).toBeInTheDocument();
    const currency = await screen.findByTestId('currency-input');
    expect(currency).toBeInTheDocument();
    const method = await screen.findByTestId('method-input');
    expect(method).toBeInTheDocument();
    expect(method).toHaveTextContent('DinheiroCartão de créditoCartão de débito');
    const tag = await screen.findByTestId('tag-input');
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveTextContent('AlimentaçãoLazerTrabalhoTransporteSaúde');
    const description = await screen.findByTestId('description-input');
    expect(description).toBeInTheDocument();
    const options = await screen.findAllByRole('option');
    options.forEach((option, index) => {
      expect(option).toBeInTheDocument();
      expect(option).toHaveTextContent(optionsArr[index]);
    });
    expect(store.getState().wallet.currencies).toEqual(Object.keys(mockData).filter((curr) => curr !== 'USDT'));
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/all');
  });
});

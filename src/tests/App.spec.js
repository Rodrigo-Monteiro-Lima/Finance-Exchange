import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import mockFetch from './helpers/mockFetch';
import mockData from './helpers/mockData';

const getTotal = () => screen.queryByTestId('total-field');
const debit = 'Cartão de débito';
const optionsArr = ['USD', 'CAD', 'EUR', 'GBP', 'ARS', 'BTC', 'LTC', 'JPY', 'CHF', 'AUD', 'CNY', 'ILS', 'ETH', 'XRP', 'DOGE', 'Dinheiro', 'Cartão de crédito', debit, 'Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
const getValue = () => screen.getByTestId('value-input');
const getDescription = () => screen.getByTestId('description-input');
const getAddBtn = () => screen.queryByRole('button', { name: 'Adicionar despesa' });
const expObj = () => ({
  id: 0,
  value: '11',
  currency: 'USD',
  method: 'Cartão de débito',
  tag: 'Lazer',
  description: 'Onze dólares',
  exchangeRates: mockData,
});

describe('Testing App component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockFetch);
  });

  afterEach(() => {
    global.fetch.mockClear();
  });
  it('Testing if renders in path "/"', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });
  it('Testing if renders correctly', () => {
    renderWithRouterAndRedux(<App />);
    const title = screen.getByRole('heading', { name: 'TrybeWallet', level: 1 });
    expect(title).toBeInTheDocument();
    const login = screen.getByRole('heading', { name: 'Login', level: 3 });
    expect(login).toBeInTheDocument();
    const email = screen.getByPlaceholderText('Email');
    expect(email).toBeInTheDocument();
    expect(email).toHaveProperty('type', 'email');
    const password = screen.getByPlaceholderText('Senha');
    expect(password).toBeInTheDocument();
    expect(password).toHaveProperty('type', 'password');
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Entrar');
  });
  it('Testing if passing a wrong email or password the button is disabled', () => {
    renderWithRouterAndRedux(<App />);
    const test = ['alguem 12345', 'alguem 123456'];
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Senha');
    const button = screen.getByRole('button');
    test.forEach((item) => {
      const arr = item.split(' ');
      userEvent.type(email, arr[0]);
      userEvent.type(password, arr[1]);
      expect(button).toBeDisabled();
    });
  });
  it('Testing if passing a right email and password the button is enabled', () => {
    renderWithRouterAndRedux(<App />);
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Senha');
    const button = screen.getByRole('button');
    userEvent.type(email, 'alguem@alguem.com');
    userEvent.type(password, '123456');
    expect(button).toBeEnabled();
  });
  it('Testing if when a user logs in the email is sent to globalState and its redirect to "/carteira"', () => {
    const mockEmail = 'alguem@alguem.com';
    const { store, history } = renderWithRouterAndRedux(<App />);
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Senha');
    const button = screen.getByRole('button');
    userEvent.type(email, mockEmail);
    userEvent.type(password, '123456');
    userEvent.click(button);
    expect(store.getState().user.email).toBe(mockEmail);
    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');
  });
  it('Testing if after login, renders "/carteira" correctly', () => {
    const initialState = {
      user: {
        email: 'email@test.com',
      },
    };
    const { store } = renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const email = screen.queryByTestId('email-field');
    expect(email).toBeInTheDocument();
    expect(store.getState().user.email).toBe(initialState.user.email);
    expect(email).toHaveTextContent(initialState.user.email);
    const total = getTotal();
    expect(total).toBeInTheDocument();
    expect(total).toHaveTextContent('0');
    const currency = screen.queryByTestId('header-currency-field');
    expect(currency).toBeInTheDocument();
    expect(currency).toHaveTextContent('BRL');
  });
  it('Testing trying to enter "/carteira" without login a message apear on the screen', () => {
    const initialState = {
      user: {
        email: '',
      },
    };
    const { store } = renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const loginMessage = screen.getByRole('heading', { name: 'Login não efetuado!', level: 2 });
    expect(loginMessage).toBeInTheDocument();
    expect(store.getState().user.email).toBe(initialState.user.email);
  });
  it('Testing when "/carteira" is render api is fetched', () => {
    const initialState = {
      user: {
        email: 'email@test.com',
      },
    };
    renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/all');
  });
  it('Testing if currencies key have received fetch results', async () => {
    const initialState = {
      user: {
        email: 'alguem@otoloco.com',
      },
      wallet: {
        currencies: [...Object.keys(mockData).filter((currency) => currency !== 'USDT')],
      },
    };
    const { store } = renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    expect(global.fetch).toHaveBeenCalled();
    expect(store.getState().wallet.currencies).toEqual(Object.keys(mockData).filter((currency) => currency !== 'USDT'));
  });
  it('Testing if render WallerForm component on screen', () => {
    const initialState = {
      user: {
        email: 'alguem@test.com',
      },
      wallet: {
        currencies: [...Object.keys(mockData).filter((currency) => currency !== 'USDT')],
      },
    };
    renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const value = getValue();
    expect(value).toBeInTheDocument();
    const currency = screen.getByTestId('currency-input');
    expect(currency).toBeInTheDocument();
    const method = screen.getByTestId('method-input');
    expect(method).toBeInTheDocument();
    const tag = screen.getByTestId('tag-input');
    expect(tag).toBeInTheDocument();
    const description = getDescription();
    expect(description).toBeInTheDocument();
    const btn = getAddBtn();
    expect(btn).toBeInTheDocument();
    const options = screen.getAllByRole('option');
    options.forEach((option, index) => {
      expect(option).toBeInTheDocument();
      expect(option).toHaveTextContent(optionsArr[index]);
    });
  });
  it('Testing if render Table component on screen', () => {
    const initialState = {
      user: {
        email: 'alguem@test.com',
      },
    };
    const ths = ['Descrição', 'Tag', 'Método de pagamento', 'Valor', 'Moeda', 'Câmbio utilizado', 'Valor convertido', 'Moeda de conversão', 'Editar/Excluir'];
    renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const row = screen.getByRole('row', 'Descrição Tag Método de pagamento Valor Moeda Câmbio utilizado Valor convertido Moeda de conversão Editar/Excluir');
    expect(row).toBeInTheDocument();
    const columns = screen.getAllByRole('columnheader');
    columns.forEach((column, index) => {
      expect(column).toBeInTheDocument();
      expect(column).toHaveTextContent(ths[index]);
    });
  });
  it('Testing if a expense render on screen', () => {
    const initialState = {
      user: {
        email: 'alguem@gemal.com',
      },
      wallet: {
        currencies: [...Object.keys(mockData).filter((currency) => currency !== 'USDT')],
        expenses: [expObj()],
      },
    };
    renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const tds = ['Onze dólares', 'Lazer', debit, '11.00', 'Dólar Americano/Real Brasileiro', '4.75', '52.28', 'Real', 'EditarExcluir'];
    const cells = screen.getAllByRole('cell');
    cells.forEach((cell, index) => {
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveTextContent(tds[index]);
    });
  });
  it('Testing if a expense can be deleted', () => {
    const initialState = {
      user: {
        email: 'alguem@gemail.com',
      },
      wallet: {
        currencies: [...Object.keys(mockData).filter((currency) => currency !== 'USDT')],
        expenses: [{
          id: 0,
          value: '11',
          currency: 'USD',
          method: 'Dinheiro',
          tag: 'Lazer',
          description: 'Onze dol',
          exchangeRates: mockData,
        }],
      },
    };
    const { store } = renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const btnDel = screen.getByRole('button', { name: 'Excluir' });
    userEvent.click(btnDel);
    const cells = screen.queryAllByRole('cell');
    cells.forEach((cell) => {
      expect(cell).not.toBeInTheDocument();
    });
    expect(store.getState().wallet.expenses).toEqual([]);
  });
  it('Testing if a expense can be edited', () => {
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
        total: '61.15',
      },
    };
    const tds = ['remédio', 'Saúde', 'Dinheiro', '10.00', 'Dólar Americano/Real Brasileiro', '4.75', '47.53', 'Real', 'EditarExcluir'];
    renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const total = getTotal();
    expect(total).toHaveTextContent('61.15');
    const btnEdit = screen.getAllByRole('button', { name: 'Editar' });
    userEvent.click(btnEdit[0]);
    const btnAdd = getAddBtn();
    expect(btnAdd).not.toBeInTheDocument();
    const btnSave = screen.queryByRole('button', { name: 'Editar despesa' });
    expect(btnSave).toBeInTheDocument();
    const value = getValue();
    userEvent.type(value, '10');
    const currency = screen.getByTestId('currency-input');
    userEvent.selectOptions(currency, 'USD');
    const method = screen.getByTestId('method-input');
    userEvent.selectOptions(method, 'Dinheiro');
    const tag = screen.getByTestId('tag-input');
    userEvent.selectOptions(tag, 'Saúde');
    const description = getDescription();
    userEvent.type(description, 'remédio');
    userEvent.click(btnSave);
    const cells = screen.queryAllByRole('cell');
    cells.forEach((cell, index) => {
      if (index < 8) {
        expect(cell).toBeInTheDocument();
        expect(cell).toHaveTextContent(tds[index]);
      }
    });
    const newTotal = getTotal();
    expect(newTotal).toHaveTextContent('52.28');
  });
  it('Testing if a new expense is added correctly and goes to globalstate', async () => {
    const initialState = {
      user: {
        email: 'testm@test.com',
      },
    };
    const { store } = renderWithRouterAndRedux(<App />, { initialState, initialEntries: ['/carteira'] });
    const valueInput = getValue();
    userEvent.type(valueInput, '5');
    const descriptionInput = getDescription();
    userEvent.type(descriptionInput, 'pão');
    const btn = getAddBtn();
    userEvent.click(btn);
    const value = await screen.findByText('5.00');
    expect(value).toBeInTheDocument();
    const description = await screen.findByText('pão');
    expect(description).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(store.getState().wallet.expenses).toHaveLength(1);
  });
});

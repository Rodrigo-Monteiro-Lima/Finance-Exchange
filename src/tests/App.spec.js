import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';

describe('Testing App component', () => {
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
    const test = ['alguem 12345', 'alguem 123456'/* , 'alguem@alguem.com 12345' */];
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Senha');
    const button = screen.getByRole('button');
    test.forEach((item) => {
      const arr = item.split(' ');
      userEvent.type(email, arr[0]);
      userEvent.type(password, arr[1]);
      expect(button).toBeDisabled();
    });
    // userEvent.type(email, 'alguem@alguem.com');
    // userEvent.type(password, '12345');
    // expect(button).toBeDisabled();
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
    const total = screen.queryByTestId('total-field');
    expect(total).toBeInTheDocument();
    expect(total).toHaveTextContent('0');
    const currency = screen.queryByTestId('header-currency-field');
    expect(currency).toBeInTheDocument();
    expect(currency).toHaveTextContent('BRL');
  });
});

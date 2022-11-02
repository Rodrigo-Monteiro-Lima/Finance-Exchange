import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import mockFetch from './helpers/mockFetch';
import Login from '../pages/Login';

describe('Startest Login', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockFetch);
  });
  afterEach(() => {
    global.fetch.mockClear();
  });
  it('Login tests', () => {
    const test = ['alguem 12345', 'alguem 123456', 'alguem@alguem.com 11245'];
    const { history } = renderWithRouterAndRedux(<Login />);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
    const email = screen.getByTestId('email-input');
    expect(email).toBeInTheDocument();
    const password = screen.getByTestId('password-input');
    expect(password).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Entrar' });
    expect(button).toBeInTheDocument();
    test.forEach((item) => {
      const arr = item.split(' ');
      userEvent.type(email, arr[0]);
      userEvent.type(password, arr[1]);
      expect(button).toBeDisabled();
      userEvent.clear(email);
      userEvent.clear(password);
    });
  });
  it('More Login tests', () => {
    const { history, store } = renderWithRouterAndRedux(<App />);
    const email = screen.getByTestId('email-input');
    userEvent.type(email, 'alguem@alguem.com');
    const password = screen.getByTestId('password-input');
    userEvent.type(password, '123456');
    const button = screen.getByRole('button', { name: 'Entrar' });
    expect(button).toBeEnabled();
    userEvent.click(button);
    expect(store.getState().user.email).toBe('alguem@alguem.com');
    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');
  });
});

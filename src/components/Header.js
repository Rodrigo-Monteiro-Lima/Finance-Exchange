import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Header.css';
import logo from '../assets/imgs/logoTrybeWallet.png';
import user from '../assets/imgs/Vector.png';
import coin from '../assets/imgs/Moedas.svg';

class Header extends Component {
  render() {
    const { email, expenses } = this.props;
    return (
      <header style={ { display: 'flex', justifyContent: 'space-around' } }>
        <img src={ logo } alt="logo" />
        <div className="expense-container">
          <img src={ coin } alt="Moedas ícone" className="coin" />
          Total de despesas:
          <div data-testid="total-field" className="total-container">
            {/* {Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} */}
            {/* {total} */}
            {expenses ? (expenses
              .reduce((acc, curr) => acc + (curr.value * curr
                .exchangeRates[curr.currency].ask), 0)).toFixed(2) : 0.00}
          </div>
          <div data-testid="header-currency-field" className="currency">BRL</div>
        </div>
        <div data-testid="email-field" className="email-container">
          <img src={ user } alt="user ícone" className="user" />
          {email}
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const mapStateToProps = ({ user: { email }, wallet: { expenses } }) => ({
  email,
  expenses,
});

export default connect(mapStateToProps)(Header);

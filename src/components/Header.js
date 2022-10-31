import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends Component {
  render() {
    const { email, total } = this.props;
    return (
      <header style={ { display: 'flex', justifyContent: 'space-around' } }>
        <div data-testid="email-field">{email}</div>
        <div data-testid="total-field">{total}</div>
        <div data-testid="header-currency-field">BRL</div>
      </header>
    );
  }
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
};

const mapStateToProps = ({ user: { email }, wallet: { total } }) => ({
  email,
  total,
});

export default connect(mapStateToProps)(Header);

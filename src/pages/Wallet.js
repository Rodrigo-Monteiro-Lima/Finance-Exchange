import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';
import Table from '../components/Table';
import './Wallet.css';

class Wallet extends React.Component {
  render() {
    const { email } = this.props;
    if (!email) return <h2>Login não efetuado!</h2>;
    return (
      <div>
        <Header />
        <div className="form-table-container">
          <WalletForm />
          <Table />
        </div>
      </div>
    );
  }
}

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
};

const mapStateToProps = ({ user: { email } }) => ({
  email,
});

export default connect(mapStateToProps)(Wallet);

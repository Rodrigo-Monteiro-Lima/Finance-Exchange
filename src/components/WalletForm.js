import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchAPI, addExpense, saveEditExpense } from '../redux/actions';
import getCurrentCoinQuotation from '../services/coinQuotationAPI';
import './WalletForm.css';

class WalletForm extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
      description: '',
      id: 0,
    };
  }

  componentDidMount() {
    const { fetchCurrencies } = this.props;
    fetchCurrencies();
  }

  componentDidUpdate(prevProps) {
    const { editor, expenses, idToEdit } = this.props;
    if (editor && prevProps.editor === false) {
      const expenseToEdit = expenses.find((item) => item.id === idToEdit);
      this.setState({
        id: expenseToEdit.id,
        value: expenseToEdit.value,
        currency: expenseToEdit.currency,
        method: expenseToEdit.method,
        tag: expenseToEdit.tag,
        description: expenseToEdit.description,
      });
    }
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  resetState = () => ({
    value: '',
    currency: 'USD',
    tag: 'Alimentação',
    method: 'Dinheiro',
    description: '',
  });

  handleClick = async (expense) => {
    const { newExpense } = this.props;
    this.setState((prev) => ({
      id: prev.id + 1,
      ...this.resetState(),
    }));
    const quotation = await getCurrentCoinQuotation();
    expense.exchangeRates = quotation;
    newExpense(expense);
  };

  handleSave = (expense) => {
    const { saveExpense, expenses, idToEdit } = this.props;
    const expenseToEdit = expenses.find((item) => item.id === idToEdit);
    const editIndex = expenses.findIndex((item) => item.id === idToEdit);
    // expenses[editIndex] = { ...expenseToEdit, ...expense };
    const editedExpense = { ...expenseToEdit, ...expense };
    saveExpense(editedExpense, editIndex);
    this.setState(({
      id: expenses[expenses.length - 1].id + 1,
      ...this.resetState(),
    }));
  };

  render() {
    const { currency, description, method, tag, value, id } = this.state;
    const { currencies, editor } = this.props;
    const expense = {
      id,
      value,
      currency,
      method,
      tag,
      description,
    };

    return (
      <form action="" data-testid="form" className="expense-form">
        <div className="form-input-container">
          <label htmlFor="description">
            Descrição da despesa
            {' '}
            <input
              type="text"
              data-testid="description-input"
              name="description"
              id="description"
              value={ description }
              onChange={ this.handleChange }
              className="description"
            />
          </label>
          <label htmlFor="tag">
            Categoria da despesa
            <select
              name="tag"
              id="tag"
              data-testid="tag-input"
              value={ tag }
              onChange={ this.handleChange }
              className="tag"
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
            </select>
          </label>
          <label htmlFor="value">
            Valor
            <input
              type="number"
              name="value"
              id="value"
              data-testid="value-input"
              onChange={ this.handleChange }
              value={ value }
              className="value"
            />
          </label>
          <label htmlFor="method">
            Método de pagamento
            <select
              name="method"
              id="method"
              data-testid="method-input"
              value={ method }
              onChange={ this.handleChange }
              className="method"
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
            </select>
          </label>
          <label htmlFor="currency">
            Moeda
            <select
              name="currency"
              id="currency"
              data-testid="currency-input"
              value={ currency }
              onChange={ this.handleChange }
              className="currencies"
            >
              {currencies.map((item) => (
                <option value={ item } key={ item }>{item}</option>))}
            </select>
          </label>
        </div>
        <div className="button-container">
          <button
            type="button"
            onClick={ editor ? () => this.handleSave(expense)
              : () => this.handleClick(expense) }
            className="add-button"
          >
            {editor ? 'Editar despesa' : 'Adicionar despesa'}

          </button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = ({ wallet: { currencies, editor, idToEdit, expenses } }) => ({
  currencies,
  editor,
  idToEdit,
  expenses,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCurrencies: () => dispatch(fetchAPI()),
  newExpense: (expense, exchange) => dispatch(addExpense(expense, exchange)),
  saveExpense: (expenses, index) => dispatch(saveEditExpense(expenses, index)),

});

WalletForm.propTypes = {
  fetchCurrencies: PropTypes.func.isRequired,
  newExpense: PropTypes.func.isRequired,
  saveExpense: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  editor: PropTypes.bool.isRequired,
  idToEdit: PropTypes.number.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Table.css';
import { MdDeleteForever } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { deleteExpense, editExpense } from '../redux/actions';

class Table extends Component {
  render() {
    const { expenses, removeExpense, edit } = this.props;
    return (
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tag</th>
            <th>Método de pagamento</th>
            <th>Valor</th>
            <th>Moeda</th>
            <th>Câmbio utilizado</th>
            <th>Valor convertido</th>
            <th>Moeda de conversão</th>
            <th>Editar/Excluir</th>
          </tr>
        </thead>
        <tbody>
          {expenses && expenses.map((expense, index) => (
            <tr key={ expense.id }>
              <td>{expense.description}</td>
              <td>{expense.tag}</td>
              <td>{expense.method}</td>
              <td>{Number(expense.value).toFixed(2)}</td>
              <td>{expense.exchangeRates[expense.currency].name}</td>
              <td>
                {Number(expense.exchangeRates[expense.currency].ask).toFixed(2)}
                {/* .toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' },
                  ) */}

              </td>
              <td>
                {Number(expense.value
                  * expense.exchangeRates[expense.currency].ask).toFixed(2)}
                {/* .toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' },
                  )  */}
              </td>
              <td>Real</td>
              <td>
                <div className="buttons">
                  <button
                    type="button"
                    data-testid="edit-btn"
                    onClick={ () => edit(expense.id) }
                    className="edit-button"
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    type="button"
                    data-testid="delete-btn"
                    onClick={ () => removeExpense(index) }
                    className="delete-button"
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  removeExpense: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
};

const mapStateToProps = ({ wallet: { expenses } }) => ({
  expenses,
});

const mapDispatchToProps = (dispatch) => ({
  removeExpense: (index) => dispatch(deleteExpense(index)),
  edit: (id) => dispatch(editExpense(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);

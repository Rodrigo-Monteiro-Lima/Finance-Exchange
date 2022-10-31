import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { login } from '../redux/actions';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      // emailError: false,
      password: '',
      // passwordError: false,
      isButtonDisabled: true,
      showPassword: false,
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, this.buttonValidation);
  };

  handleClick = (user) => {
    const { history, sendUser } = this.props;
    sendUser(user);
    history.push('/carteira');
  };

  handleShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({
      showPassword: !showPassword,
    });
  };

  buttonValidation = () => {
    const { password, email } = this.state;
    const minChar = 6;
    const emailTest = email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i);
    const passwordTest = password.length >= minChar;
    // this.setState({
    //   emailError: !emailTest,
    //   passwordError: !passwordTest,
    // });
    if (emailTest && passwordTest) {
      this.setState({
        isButtonDisabled: false,
      });
    } else {
      this.setState({
        isButtonDisabled: true,
      });
    }
  };

  render() {
    const {
      email,
      password,
      isButtonDisabled,
      showPassword,
    //  passwordError,
    //   emailError,
    } = this.state;
    // const errorEmail = (
    //   <p style={ { color: 'red' } }>
    //     O email precisa ser no formato email@email.com!
    //   </p>);
    // const minPass = (
    //   <p style={ { color: 'red' } }>
    //     A senha precisa possuir 6 ou mais caracteres!
    //   </p>);

    return (
      <div>
        <h1>TrybeWallet</h1>
        <h3>Login</h3>
        <form action="">
          <label htmlFor="email">
            <input
              type="email"
              id="email"
              name="email"
              data-testid="email-input"
              onChange={ this.handleChange }
              value={ email }
              placeholder="Email"
            />
            {/* {emailError && errorEmail} */}
          </label>
          <div style={ { display: 'inline-block' } }>
            <label htmlFor="password" className="password">
              <input
                type={ showPassword ? 'text' : 'password' }
                id="password"
                name="password"
                data-testid="password-input"
                onChange={ this.handleChange }
                value={ password }
                className="passwordInput"
                placeholder="Senha"
              />
              { showPassword
                ? <BsFillEyeSlashFill onClick={ this.handleShowPassword } />
                : <BsFillEyeFill onClick={ this.handleShowPassword } />}
            </label>
            {/* {passwordError && minPass } */}
          </div>
          <button
            type="button"
            data-testid="login-submit-button"
            disabled={ isButtonDisabled }
            onClick={ () => this.handleClick(email) }
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  sendUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  sendUser: (user) => dispatch(login(user)),
});

export default connect(null, mapDispatchToProps)(Login);

import React, { Component } from 'react';
import axios from 'axios';
import FormInput from './FormInput';
import './form.css';

class SigninForm extends Component {

  state = {
    errors: {},
    login: '',
    password: ''
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value
    });
  }

  signinHandler = (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.signinHandler} onChange={this.handleChange}>
        <FormInput
          name='login'
          type='text'
          value={this.state.login}
          error={this.state.errors.login}
        ></FormInput>
        <FormInput
          name='password'
          type='password'
          value={this.state.password}
          error={this.state.errors.password}
        ></FormInput>
        <p>
          <input type='submit' value='Signin !'></input>
        </p>
      </form>

    );
  }
}

export default SigninForm;

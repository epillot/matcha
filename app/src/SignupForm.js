import React, { Component } from 'react';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import FormInput from './FormInput';
import './form.css';

class SignupForm extends Component {

  state = {
    errors: {},
    confirmation: '',
    firstname: '',
    lastname: '',
    login: '',
    password: '',
    confirmPassword: '',
    email: ''
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value
    });
  }

  handleSelect = ({ target }) => {
    let errors = this.state.errors;
    errors[target.name] = '';
    this.setState({
      errors: errors
    });
  }

  signupHandler = async (e) => {
    e.preventDefault();
    const input = {
      firstname: this.state.firstname.trim(),
      lastname: this.state.lastname.trim(),
      login: this.state.login.trim(),
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      email: this.state.email.trim()
    };
    try {
      const { data } = await axios.post('/api/signup', input);
      const len = Object.keys(data).length;
      this.setState( (prevState) => {
        return {
          errors: data,
          confirmation: (len === 0 ? 'Your account is created, please check your email to complete your signup !' : ''),
          firstname: len === 0 ? '' : prevState.firstname,
          lastname: len === 0 ? '' : prevState.lastname,
          login: len === 0 ? '' : prevState.login,
          password: len === 0 ? '' : prevState.password,
          confirmPassword: len === 0 ? '' : prevState.confirmPassword,
          email: len === 0 ? '' : prevState.email
        };
      });
    } catch (e) { console.log(e) }
  }

  render() {
    return (
      <div className='container'>
        <form onSubmit={this.signupHandler} onChange={this.handleChange} onSelect={this.handleSelect}>
          <FormInput
            name='firstname'
            type='text'
            value={this.state.firstname}
            error={this.state.errors.firstname}
          ></FormInput>
          <FormInput
            name='lastname'
            type='text'
            value={this.state.lastname}
            error={this.state.errors.lastname}
          ></FormInput>
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
          <FormInput
            name='confirmPassword'
            type='password'
            value={this.state.confirmPassword}
            error={this.state.errors.confirmPassword}
          ></FormInput>
          <FormInput
            name='email'
            type='email'
            value={this.state.email}
            error={this.state.errors.email}
          ></FormInput>
          <RaisedButton type='submit' label='Signup' primary={true}></RaisedButton>
          <p>{this.state.confirmation}</p>
        </form>
      </div>
    );
  }
}

export default SignupForm;

import React, { Component } from 'react';
import axios from 'axios';
import './Signup.css';

class Signup extends Component {

  state = {
    errors: {},
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

  handleClick = ({ target }) => {
    let errors = this.state.errors;
    errors[target.name] = '';
    this.setState({
      errors: errors
    });
  }

  signupHandler = (e) => {
    e.preventDefault();

    const {
      firstname,
      lastname,
      login,
      password,
      confirmPassword,
      email
    } = this.state;

    const input = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      login: login.trim(),
      password: password,
      confirmPassword: confirmPassword,
      email: email.trim()
    };

    axios.post('/api/signup', input)
    .then( (res) => {
      this.setState({
        errors: res.data
      });
      if (Object.keys(res.data).length === 0) {
        this.setState({
          firstname: '',
          lastname: '',
          login: '',
          password: '',
          confirmPassword: '',
          email: ''
        });
      }
    })
    .catch( (err) => console.log(err) );
  }

  render() {
    return (
      <form onSubmit={this.signupHandler} onChange={this.handleChange}>
        <p>
          <label htmlFor='firstname'>Firstname: </label>
          <input
            onClick={this.handleClick}
            value={this.state.firstname}
            className={this.state.errors['firstname'] ? 'err_input' : '' }
            type='text'
            name='firstname'
          ></input>
          <span className='err_msg'>{this.state.errors['firstname']}</span>
        </p>
        <p>
          <label htmlFor='lastname'>Lastname: </label>
          <input
            onClick={this.handleClick}
            value={this.state.lastname}
            className={this.state.errors['lastname'] ? 'err_input' : '' }
            type='text'
            name='lastname'
          ></input>
          <span className='err_msg'>{this.state.errors['lastname']}</span>
        </p>
        <p>
          <label htmlFor='login'>Login: </label>
          <input
            onClick={this.handleClick}
            value={this.state.login}
            className={this.state.errors['login'] ? 'err_input' : '' }
            type='text'
            name='login'
          ></input>
          <span className='err_msg'>{this.state.errors['login']}</span>
        </p>
        <p>
          <label htmlFor='password'>Password: </label>
          <input
            onClick={this.handleClick}
            value={this.state.password}
            className={this.state.errors['password'] ? 'err_input' : '' }
            type='password'
            name='password'
          ></input>
          <span className='err_msg'>{this.state.errors['password']}</span>
        </p>
        <p>
          <label htmlFor='confirmPassword'>Confirm password: </label>
          <input
            onClick={this.handleClick}
            value={this.state.confirmPassword}
            className={this.state.errors['confirmPassword'] ? 'err_input' : '' }
            type='password'
            name='confirmPassword'
          ></input>
          <span className='err_msg'>{this.state.errors['confirmPassword']}</span>
        </p>
        <p>
          <label htmlFor='email'>Email: </label>
          <input
            onClick={this.handleClick}
            value={this.state.email}
            className={this.state.errors['email'] ? 'err_input' : '' }
            type='email'
            name='email'
          ></input>
          <span className='err_msg'>{this.state.errors['email']}</span>
        </p>
        <p>
          <input type='submit' value='Create my account !'></input>
        </p>
      </form>
    );
  }
}

export default Signup;

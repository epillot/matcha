import React, { Component } from 'react';
import axios from 'axios';

class Signup extends Component {

  state = {
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

  signupHandler = (e) => {
    e.preventDefault();
    axios.post('/api/signup', this.state)
    .then( (res) => console.log(res) )
    .catch( (err) => console.log(err) );
  }

  render() {
    return (
      <form className='txtcenter' onSubmit={this.signupHandler} onChange={this.handleChange}>
        <p>
          <label htmlFor='firstname'>Firstname: </label>
          <input type='text' name='firstname'></input>
        </p>
        <p>
          <label htmlFor='lastname'>Lastname: </label>
          <input type='text' name='lastname'></input>
        </p>
        <p>
          <label htmlFor='login'>Login: </label>
          <input type='text' name='login'></input>
        </p>
        <p>
          <label htmlFor='password'>Password: </label>
          <input type='password' name='password'></input>
        </p>
        <p>
          <label htmlFor='confirmPassword'>Confirm password: </label>
          <input type='password' name='confirmPassword'></input>
        </p>
        <p>
          <label htmlFor='email'>Email: </label>
          <input type='email' name='email'></input>
        </p>
        <p>
          <input type='submit' value='Create my account !'></input>
        </p>
      </form>
    );
  }
}

export default Signup;

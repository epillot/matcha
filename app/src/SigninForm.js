import React, { Component } from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import FormInput from './FormInput';
import RaisedButton from 'material-ui/RaisedButton';
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

  handleSelect = ({ target }) => {
    let errors = this.state.errors;
    errors[target.name] = '';
    this.setState({
      errors: errors
    });
  }

  signinHandler = async (e) => {
    e.preventDefault();
    const input = {
      login: this.state.login.trim(),
      password: this.state.password
    }
    try {
      const { data } = await axios.post('/api/signin', input);
      if (data.token === undefined) {
        this.setState({
          errors: data
        })
      }
      else {
        localStorage.setItem('c_user', data.token);
        this.props.onLog();
      }
    } catch (e) { console.log(e) }

  }

  render() {
    console.log(this.props);
    return (
      <div className='container'>
        <Paper zDepth={3} style={{padding: 20}}>
          <form onSubmit={this.signinHandler} onChange={this.handleChange} onSelect={this.handleSelect}>
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
            <RaisedButton type='submit' label='Signin' primary={true}></RaisedButton>
          </form>
        </Paper>
      </div>
    );
  }
}

export default SigninForm;

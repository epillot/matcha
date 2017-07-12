import React, { Component } from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FormInput from './FormInput';
import CircularProgress from 'material-ui/CircularProgress';
import parser from './parser';
import './form.css';

class SignupForm extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      errors: {},
      firstname: '',
      lastname: '',
      login: '',
      password: '',
      confirmPassword: '',
      email: ''
    };
    this.mounted = true;
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.signupHandler = this.signupHandler.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  handleSelect({ target }) {
    const { errors } = this.state;
    errors[target.name] = '';
    this.setState({errors});
  }

  async signupHandler(e) {
    e.preventDefault();
    if (this.state.loading) return console.log('Don\'t spam plz');
    const errors = parser.signup(this.state);
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    const input = {
      firstname: this.state.firstname.trim(),
      lastname: this.state.lastname.trim(),
      login: this.state.login.trim(),
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      email: this.state.email.trim()
    };
    this.setState({loading: true});
    try {
      const { data } = await axios.post('/api/signup', input);
      setTimeout(() => {
        if (Object.keys(data).length === 0) {
          this.props.history.push('/activation');
        } else if (this.mounted) {
          this.setState({
            errors: data,
            loading: false
          });
        }
      }, 1000);
    } catch (e) { console.log(e) }
  }

  render() {
    const style = {
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    };
    return (
      <div className='container'>
        <Paper zDepth={3} style={{padding: 20}}>
          <div style={style}>{this.state.loading ? <CircularProgress/> : ''}</div>
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
          </form>
        </Paper>
      </div>
    );
  }
}

export default SignupForm;

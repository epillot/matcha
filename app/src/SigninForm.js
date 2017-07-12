import React, { Component } from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import FormInput from './FormInput';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import parser from './parser';
import './form.css';

class SigninForm extends Component {

  constructor() {
    super();
    this.state = {
      errors: {},
      loading: false,
      login: '',
      password: ''
    };
    this.mounted = true;
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.signinHandler = this.signinHandler.bind(this);
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

  async signinHandler(e) {
    e.preventDefault();
    if (this.state.loading) return console.log('Don\'t spam plz');
    const errors = parser.signin(this.state);
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    const input = {
      login: this.state.login.trim(),
      password: this.state.password
    }
    this.setState({loading: true});
    try {
      const { data } = await axios.post('/api/signin', input);
      setTimeout(() => {
        if (data.token === undefined) {
          if (this.mounted) {
            this.setState({
              errors: data,
              loading: false
            });
          }
        } else {
          localStorage.setItem('c_user', data.token);
          this.props.onLog();
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

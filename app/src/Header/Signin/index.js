import React, { Component } from 'react';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Subheader from 'material-ui/Subheader';
import parser, { signinParser } from '../../parser';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider'

const styles = {
  container: {
    padding: '0 20px 20px 20px',
  },
};

export default class extends Component {

  constructor() {
    super();
    this.state = {
      errors: {},
      loading: false,
      login: '',
      password: '',
      email: '',
      emailErr: '',
      loadingReset: false,
    };
    this.mounted = true;
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.signinHandler = this.signinHandler.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange({ target: { name, value } }) {
    this.setState({[name]: value});
  }

  handleSelect({ target: { name } }) {
    const { errors } = this.state;
    errors[name] = '';
    this.setState({errors});
  }

  async signinHandler(e) {
    e.preventDefault();
    if (this.state.loading) return;
    const input = {
      login: this.state.login.trim(),
      password: this.state.password
    }
    const errors = signinParser(input);
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    this.setState({loading: true});
    this.props.setLoading(true);
    try {
      const { data } = await axios.post('/api/signin', input);
      setTimeout(() => {
        this.props.setLoading(false);
        if (data.token === undefined) {
          if (this.mounted) {
            this.setState({
              errors: data,
              loading: false
            });
          }
        } else {
          localStorage.setItem('c_user', data.token);
          this.props.onLog(data.user);
        }
      }, 500);
    } catch (e) { console.log(e) }
  }

  async resetPassword() {
    if (this.state.loadingReset) return;
    const { email } = this.state;
    const error = parser.email(email);
    if (error) return this.setState({emailErr: error});
    this.setState({loadingReset: true});
    this.props.setLoading(true);
    try {
      const { data: { error } } = await axios.post('/api/resetPassword', {email});
      this.props.setLoading(false);
      if (this.mounted) {
        this.setState({loadingReset: false});
        if (error) return this.setState({emailErr: error});
        this.setState({email: ''});
        this.props.onResetPw();
      }
    } catch (e) { console.log(e) }
  }

  render() {
    return (
      <div>
        <Subheader>Signin with your account</Subheader>
        <form style={styles.container} onSubmit={this.signinHandler} onChange={this.handleChange} onSelect={this.handleSelect}>
          <TextField
            name='login'
            floatingLabelText='Login'
            type='text'
            value={this.state.login}
            errorText={this.state.errors.login}
            autoComplete="off"
          />
          <br/>
          <TextField
            name='password'
            type='password'
            floatingLabelText='Password'
            value={this.state.password}
            errorText={this.state.errors.password}
            autoComplete="off"
          />
          <br/>
          <RaisedButton
            type='submit'
            label='Signin'
            primary={true}
            disabled={this.state.loading}
          />
        </form>
        <Divider/>
        <Subheader>Forgot your password ?</Subheader>
        <div style={styles.container}>
          <TextField
            name='email'
            type='email'
            floatingLabelText='Email adress'
            autoComplete="off"
            value={this.state.email}
            errorText={this.state.emailErr}
            onSelect={() => this.setState({emailErr: ''})}
            onChange={this.handleChange}
          />
          <br/>
          <RaisedButton
            onTouchTap={this.resetPassword}
            label='Reset password'
            primary={true}
            disabled={this.state.loadingReset}
          />
        </div>
        {this.state.loading ? <LinearProgress/> : ''}
      </div>
    );
  }
}

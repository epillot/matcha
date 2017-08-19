import React, { Component } from 'react';
import axios from 'axios';
import FormInput from './FormInput';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Subheader from 'material-ui/Subheader';
import parser from './parser';

const styles = {
  form: {
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
    if (this.state.loading) return console.log('Don\'t spam plz');
    const input = {
      login: this.state.login.trim(),
      password: this.state.password
    }
    const errors = parser.signin(input);
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
          console.log(data);
          localStorage.setItem('c_user', data.token);
          this.props.onLog(data.user);
        }
      }, 2000);
    } catch (e) { console.log(e) }
  }

  render() {
    return (
      <div>
        <Subheader>Signin with your account</Subheader>
        <form style={styles.form} onSubmit={this.signinHandler} onChange={this.handleChange} onSelect={this.handleSelect}>
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
          <RaisedButton type='submit' label='Signin' primary={true} disabled={this.state.loading}></RaisedButton>
        </form>
        {this.state.loading ? <LinearProgress/> : ''}
      </div>
    );
  }
}

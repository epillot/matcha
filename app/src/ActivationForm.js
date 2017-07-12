import React, { Component } from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import parser from './parser';
import RaisedButton from 'material-ui/RaisedButton';
import FormInput from './FormInput';
import './form.css';

class ActivationForm extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      errors: {},
      login: '',
      key: ''
    };
    this.mounted = true;
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.activationHandler = this.activationHandler.bind(this);
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

  async activationHandler(e) {
    e.preventDefault();
    if (this.state.loading) return console.log('Don\'t spam plz');
    const errors = parser.activation(this.state);
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    const input = {
      login: this.state.login,
      key: this.state.key
    }
    this.setState({loading: true});
    try {
      const { data } = await axios.post('/api/activation', input);
      setTimeout(() => {
        if (Object.keys(data).length === 0) {
          this.props.history.push('/signin');
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
          <form onSubmit={this.activationHandler} onChange={this.handleChange} onSelect={this.handleSelect}>
          <FormInput
            name='login'
            type='text'
            value={this.state.login}
            error={this.state.errors.login}
          ></FormInput>
          <FormInput
            name='key'
            type='text'
            value={this.state.key}
            error={this.state.errors.key}
          ></FormInput>
          <RaisedButton type='submit' label='Ok' primary={true}></RaisedButton>
          </form>
        </Paper>
      </div>
    );
  }
}

export default ActivationForm;

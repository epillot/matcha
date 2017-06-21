import React, { Component } from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FormInput from './FormInput';
import './form.css';

class ActivationForm extends Component {

  state = {
    errors: {},
    login: '',
    key: ''
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

  activationHandler = async (e) => {
    e.preventDefault();
    const input = {
      login: this.state.login,
      key: this.state.key
    }
    try {
      const { data } = await axios.post('/api/activation', input);
      if (Object.keys(data).length === 0) {
        this.props.history.push('/signin');
      }
      else {
        this.setState({
          errors: data
        });
      }
    } catch (e) { console.log(e) }
  }

  render() {
    return (
      <div className='container'>
        <Paper zDepth={3} style={{padding: 20}}>
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

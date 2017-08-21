import React, { Component } from 'react';
import FormInput from './FormInput';
import RaisedButton from 'material-ui/RaisedButton';
import parser from './parser';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      firstname: props.firstname,
      lastname: props.lastname,
      login: props.login,
      email: props.email,
    }
  }

  render() {
    return (
      <form>
        <FormInput
          name='firstname'
          type='text'
          value={this.state.firstname}
          error={this.state.errors.firstname}
        />
        <FormInput
          name='lastname'
          type='text'
          value={this.state.lastname}
          error={this.state.errors.lastname}
        />
        <FormInput
          name='login'
          type='text'
          value={this.state.login}
          error={this.state.errors.login}
        />
        <FormInput
          name='email'
          type='email'
          label='email adress'
          value={this.state.email}
          error={this.state.errors.email}
        />
        <RaisedButton
          type='submit'
          label='Save change'
          secondary={true}
          disabled={false}
        />
      </form>
    );
  }

}

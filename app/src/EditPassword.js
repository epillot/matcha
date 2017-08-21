import React, { Component } from 'react';
import FormInput from './FormInput';
import RaisedButton from 'material-ui/RaisedButton';
import parser from './parser';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      password: '',
      newPassword: '',
      confirmPassword: '',
    }
  }

  render() {
    return (
      <form>
        <FormInput
          name='password'
          label='actual password'
          type='password'
          value={this.state.password}
          error={this.state.errors.password}
        />
        <FormInput
          name='password'
          label='new password'
          type='password'
          value={this.state.password}
          error={this.state.errors.password}
        />
        <FormInput
          name='confirmPassword'
          type='password'
          label='confirm new password'
          value={this.state.confirmPassword}
          error={this.state.errors.confirmPassword}
        />
        <RaisedButton
          type='submit'
          label='Change password'
          secondary={true}
          disabled={false}
        />
      </form>
    );
  }

}

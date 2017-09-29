import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { editPasswordParser } from '../../../parser';
import secureRequest from '../../../secureRequest';
import TextField from 'material-ui/TextField';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      password: '',
      newPassword: '',
      confirmPassword: '',
      success: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect({ target: { name } }) {
    const { errors } = this.state;
    errors[name] = '';
    this.setState({errors});
  }

  handleSubmit(e) {
    e.preventDefault();
    const { password, newPassword, confirmPassword } = this.state;
    const data = {password, newPassword, confirmPassword}
    const errors = editPasswordParser(data);
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    const config = {
      method: 'patch',
      url: '/api' + this.props.location.pathname,
      data: {
        action: 'editPassword',
        data,
      },
    }
    secureRequest(config, (err, response) => {
      if (err) return this.props.onAuthFailed();
      const errors = response.data
      if (Object.keys(errors).length !== 0) return this.setState({errors});
      this.props.onEdit([]);
    });
  }

  render() {
    return (
      <form
        onChange={({ target: { name, value } }) => this.setState({[name]: value})}
        onSubmit={this.handleSubmit}
        onSelect={this.handleSelect}
      >
        <TextField
          name='password'
          floatingLabelText='Actual password'
          type='password'
          value={this.state.password}
          errorText={this.state.errors.password}
          autoComplete="off"
        />
        <br/>
        <TextField
          name='newPassword'
          floatingLabelText='New password'
          type='password'
          value={this.state.newPassword}
          errorText={this.state.errors.newPassword}
          autoComplete="off"
        />
        <br/>
        <TextField
          name='confirmPassword'
          type='password'
          floatingLabelText='Confirm new password'
          value={this.state.confirmPassword}
          errorText={this.state.errors.confirmPassword}
          autoComplete="off"
        />
        <br/>
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

import React, { Component } from 'react';
import FormInput from './FormInput';
import RaisedButton from 'material-ui/RaisedButton';
import parser from './parser';
import secureRequest from './secureRequest';

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
    const fields = ['firstname', 'lastname', 'login', 'email'];
    const data = [];
    const errors = {};
    fields.forEach(field => {
      const value = this.state[field].trim();
      if (value !== this.props[field]) {
        const error = parser[field](value);
        if (error) errors[field] = error;
        else data.push({field, value});
      }
    });
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    if (!data.length) return;
    const config = {
      method: 'patch',
      url: '/api' + this.props.location.pathname,
      data: {
        action: 'editInfo',
        data,
      },
    }
    secureRequest(config, (err, response) =>{
      if (err) return this.props.onAuthFailed();
      const errors = response.data;
      if (Object.keys(errors).length !== 0) return this.setState({errors});
      this.props.onEdit(data);
    });
  }

  render() {
    const { errors, firstname, lastname, login, email } = this.state;
    return (
      <form
        onChange={({ target: { name, value } }) => this.setState({[name]: value})}
        onSubmit={this.handleSubmit}
        onSelect={this.handleSelect}
      >
        <FormInput
          name='firstname'
          label='Firstname'
          type='text'
          value={firstname.trim()}
          error={errors.firstname}
        />
        <FormInput
          name='lastname'
          label='Lastname'
          type='text'
          value={lastname.trim()}
          error={errors.lastname}
        />
        <FormInput
          name='login'
          label='Login'
          type='text'
          value={login.trim()}
          error={errors.login}
        />
        <FormInput
          name='email'
          label='Email adress'
          type='email'
          value={email.trim()}
          error={errors.email}
        />
        <RaisedButton
          type='submit'
          label='Save change'
          secondary={true}
          disabled={
            firstname.trim() === this.props.firstname &&
            lastname.trim() === this.props.lastname &&
            login.trim() === this.props.login &&
            email.trim() === this.props.email
          }
        />
      </form>
    );
  }

}

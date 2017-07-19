import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import FormInput from './FormInput';

export default class extends Component {

  constructor(props) {
    super(props);
    const { firstname, lastname, login, email } = props.profile;
    this.state = {
      firstname,
      lastname,
      login,
      email,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  render() {
    const { firstname, lastname, login, email } = this.state;
    return (
      <form onChange={this.handleChange}>
        <FormInput
          name='firstname'
          value={firstname}
          type='text'
          underlineShow={false}
        ></FormInput>
        <Divider/>
        <FormInput
          name='lastname'
          value={lastname}
          type='text'
          underlineShow={false}
        ></FormInput>
        <Divider/>
        <FormInput
          name='login'
          value={login}
          type='text'
          underlineShow={false}
        ></FormInput>
        <Divider/>
        <FormInput
          name='email'
          value={email}
          type='email'
          underlineShow={false}
        ></FormInput>
        <Divider/>
      </form>
    );
  }
}

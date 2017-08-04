import React, { Component } from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FormInput from './FormInput';
import SelectField from 'material-ui/SelectField';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import LinearProgress from 'material-ui/LinearProgress';
import parser from './parser';

const styles = {
  form: {
    padding: '0 20px 20px 20px',
  },
};

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

export default class extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      errors: {},
      firstname: '',
      lastname: '',
      birthday: maxDate,
      login: '',
      password: '',
      confirmPassword: '',
      email: '',
    };
    this.mounted = true;
    this.handleChange = this.handleChange.bind(this);
    this.handleSexChange = this.handleSexChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.signupHandler = this.signupHandler.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange({ target: { name, value } }) {
    this.setState({[name]: value});
  }

  handleSexChange(e, index, sexValue) {
    const { errors } = this.state;
    errors.sexValue = '';
    this.setState({sexValue, errors});
  }

  handleDateChange(e, birthday) {
    this.setState({birthday});
  }

  handleSelect({ target: { name } }) {
    const { errors } = this.state;
    errors[name] = '';
    this.setState({errors});
  }

  async signupHandler(e) {
    e.preventDefault();
    if (this.state.loading) return console.log('Don\'t spam plz');
    const input = {
      firstname: this.state.firstname.trim(),
      lastname: this.state.lastname.trim(),
      sexValue: this.state.sexValue,
      birthday: this.state.birthday,
      login: this.state.login.trim(),
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      email: this.state.email.trim()
    };
    const errors = parser.signup(input);
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    this.setState({loading: true});
    try {
      const { data } = await axios.post('/api/signup', input);
      setTimeout(() => {
        if (Object.keys(data).length === 0) {
          this.props.history.push('/activation');
        } else if (this.mounted) {
          this.setState({
            errors: data,
            loading: false
          });
        }
      }, 2000);
    } catch (e) { console.log(e) }
  }

  render() {
    return (
      <Paper zDepth={3}>
        <Subheader>Create an account</Subheader>
        <form style={styles.form} onSubmit={this.signupHandler} onChange={this.handleChange} onSelect={this.handleSelect}>
          <FormInput
            name='firstname'
            type='text'
            value={this.state.firstname}
            error={this.state.errors.firstname}
          ></FormInput>
          <FormInput
            name='lastname'
            type='text'
            value={this.state.lastname}
            error={this.state.errors.lastname}
          ></FormInput>
          <SelectField
            floatingLabelText="sex"
            value={this.state.sexValue}
            onChange={this.handleSexChange}
            errorText={this.state.errors.sexValue}
          >
            <MenuItem value={1} primaryText="Man" />
            <MenuItem value={2} primaryText="Woman" />
          </SelectField>
          <DatePicker
            floatingLabelText="Birth date"
            maxDate={maxDate}
            value={this.state.birthday}
            onChange={this.handleDateChange}
          />
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
          <FormInput
            name='confirmPassword'
            type='password'
            label='confirm your password'
            value={this.state.confirmPassword}
            error={this.state.errors.confirmPassword}
          ></FormInput>
          <FormInput
            name='email'
            type='email'
            label='email adress'
            value={this.state.email}
            error={this.state.errors.email}
          ></FormInput>
          <RaisedButton type='submit' label='Signup' primary={true} disabled={this.state.loading}></RaisedButton>
        </form>
        {this.state.loading ? <LinearProgress/> : ''}
      </Paper>
    );
  }
}

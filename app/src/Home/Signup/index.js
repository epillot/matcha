import React, { Component } from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import LinearProgress from 'material-ui/LinearProgress';
import { signupParser } from '../../parser';

const styles = {
  root: {
    minWidth: '300px',
    width: '50%'
  },
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
    if (this.state.loading) return;
    const input = {
      firstname: this.state.firstname.trim(),
      lastname: this.state.lastname.trim(),
      sexValue: this.state.sexValue,
      birthday: this.state.birthday.toString(),
      login: this.state.login.trim(),
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      email: this.state.email.trim()
    };
    const errors = signupParser(input);
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    this.setState({loading: true});
    try {
      const { data, status } = await axios.post('/api/signup', input);
      setTimeout(() => {
        if (status === 201) this.props.history.push('/activation');
         else if (this.mounted) {
          this.setState({
            errors: data,
            loading: false,
          });
        }
      }, 2000);
    } catch (e) { console.log(e) }
  }

  render() {
    return (
      <Paper zDepth={3} style={styles.root}>
        <Subheader>Create an account</Subheader>
        <form style={styles.form} onSubmit={this.signupHandler} onChange={this.handleChange} onSelect={this.handleSelect}>
          <TextField
            name='firstname'
            floatingLabelText='Firstname'
            type='text'
            value={this.state.firstname}
            errorText={this.state.errors.firstname}
            autoComplete="off"
            fullWidth={true}
          />
          <br/>
          <TextField
            name='lastname'
            floatingLabelText='Lastname'
            type='text'
            value={this.state.lastname}
            errorText={this.state.errors.lastname}
            autoComplete="off"
            fullWidth={true}
          />
          <br/>
          <SelectField
            floatingLabelText="sex"
            value={this.state.sexValue}
            onChange={this.handleSexChange}
            errorText={this.state.errors.sexValue}
            fullWidth={true}
          >
            <MenuItem value={1} primaryText="Man" />
            <MenuItem value={2} primaryText="Woman" />
          </SelectField>
          <DatePicker
            floatingLabelText="Birth date"
            maxDate={maxDate}
            value={this.state.birthday}
            onChange={this.handleDateChange}
            fullWidth={true}
          />
          <TextField
            name='login'
            floatingLabelText='Login'
            type='text'
            value={this.state.login}
            errorText={this.state.errors.login}
            autoComplete="off"
            fullWidth={true}
          />
          <br/>
          <TextField
            name='password'
            floatingLabelText='Password'
            type='password'
            value={this.state.password}
            errorText={this.state.errors.password}
            autoComplete="off"
            fullWidth={true}
          />
          <br/>
          <TextField
            name='confirmPassword'
            type='password'
            floatingLabelText='Confirm your password'
            value={this.state.confirmPassword}
            errorText={this.state.errors.confirmPassword}
            autoComplete="off"
            fullWidth={true}
          />
          <br/>
          <TextField
            name='email'
            type='email'
            floatingLabelText='Email adress'
            value={this.state.email}
            errorText={this.state.errors.email}
            fullWidth={true}
          />
          <br/>
          <RaisedButton type='submit' label='Signup' primary={true} disabled={this.state.loading}></RaisedButton>
        </form>
        {this.state.loading ? <LinearProgress/> : ''}
      </Paper>
    );
  }
}

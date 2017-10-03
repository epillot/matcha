import React, { Component } from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import { activationParser } from '../parser';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
    if (this.state.loading) return;
    const input = {
      login: this.state.login.trim(),
      key: this.state.key
    }
    const errors = activationParser(input);
    if (Object.keys(errors).length !== 0) return this.setState({errors});
    this.setState({loading: true});
    try {
      const { data } = await axios.post('/api/activation', input);
      setTimeout(() => {
        if (Object.keys(data).length === 0) {
          this.props.history.push('/home?signin');
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
            <TextField
              name='login'
              floatingLabelText='Login'
              type='text'
              value={this.state.login}
              errorText={this.state.errors.login}
            />
            <br/>
            <TextField
              name='key'
              floatingLabelText='Key'
              type='text'
              value={this.state.key}
              errorText={this.state.errors.key}
            />
            <br/>
            <RaisedButton type='submit' label='Ok' primary={true}></RaisedButton>
          </form>
        </Paper>
      </div>
    );
  }
}

export default ActivationForm;

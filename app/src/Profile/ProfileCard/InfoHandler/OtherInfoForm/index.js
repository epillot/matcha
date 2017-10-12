import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import parser from '../../../../parser';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import secureRequest from '../../../../secureRequest';
import Geoloc from '../../../../Geoloc/';

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      sexValue: props.sexValue,
      birthday: new Date(props.birthday),
      lookingFor: props.lookingFor,
      loc: props.loc,
      adress: props.adress,
    }
    this.handleSexChange = this.handleSexChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleLookChange = this.handleLookChange.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSexChange(e, index, sexValue) {
    const { errors } = this.state;
    errors.sexValue = '';
    this.setState({sexValue, errors});
  }

  handleDateChange(e, birthday) {
    this.setState({birthday});
  }

  handleLookChange(e, index, lookingFor) {
    const { errors } = this.state;
    errors.lookingFor = '';
    this.setState({lookingFor, errors});
  }

  handleLocChange(coordinates, adress) {
    const loc = {
      type: 'Point',
      coordinates,
    }
    this.setState({loc, adress});
  }

  handleSubmit(e) {
    e.preventDefault();
    const fields = ['sexValue', 'birthday', 'lookingFor', 'loc', 'adress'];
    const data = [];
    const errors = {};
    fields.forEach(field => {
      let value = this.state[field];
      let props = this.props[field];
      if (field === 'birthday') {
        props = new Date(this.props.birthday).toString();
        value = value.toString();
      }
      if (value !== props) {
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
    const { sexValue, birthday, lookingFor, errors, loc, adress } = this.state;
    const { coordinates: [ lng, lat ] } = loc;
    return (
      <form onSubmit={this.handleSubmit}>
        <SelectField
          floatingLabelText="Sex"
          value={sexValue}
          onChange={this.handleSexChange}
          errorText={errors.sexValue}
        >
          <MenuItem value={1} primaryText="Man" />
          <MenuItem value={2} primaryText="Woman" />
        </SelectField>
        <DatePicker
          floatingLabelText="Birth date"
          maxDate={maxDate}
          value={birthday}
          onChange={this.handleDateChange}
        />
        <SelectField
          floatingLabelText="Interested By"
          value={lookingFor}
          onChange={this.handleLookChange}
          errorText={errors.lookingFor}
        >
          <MenuItem value={1} primaryText="Men" />
          <MenuItem value={2} primaryText="Women" />
          <MenuItem value={3} primaryText="Both" />
        </SelectField>
        <br/>
        <Geoloc
          adress={adress}
          lng={+lng}
          lat={+lat}
          onUpdate={this.handleLocChange}
        />
        <br/>
        <RaisedButton
          type='submit'
          label='Save change'
          secondary={true}
          disabled={
            sexValue === this.props.sexValue &&
            birthday.toString() === new Date (this.props.birthday).toString() &&
            lookingFor === this.props.lookingFor &&
            adress === this.props.adress
          }
        />
      </form>
    );
  }

}

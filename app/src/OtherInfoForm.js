import React, { Component } from 'react';
import FormInput from './FormInput';
import RaisedButton from 'material-ui/RaisedButton';
import parser from './parser';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      sex: props.sex === 'M' ? 1 : 2,
      birthday: new Date(props.birthday),
      lookingFor: props.lookingFor === 'W' ? 1 : props.lookingFor === 'M' ? 2 : 3,
    }
  }

  render() {
    return (
      <form>
        <SelectField
          floatingLabelText="Sex"
          value={this.state.sex}
          onChange={this.handleSexChange}
          errorText={this.state.errors.sex}
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
        <SelectField
          floatingLabelText="interestedBy"
          value={this.state.lookingFor}
          onChange={this.handleOrientation}
          errorText={this.state.errors.lookingFor}
        >
          <MenuItem value={1} primaryText="Woman" />
          <MenuItem value={2} primaryText="Man" />
          <MenuItem value={3} primaryText="Both" />
        </SelectField>
        <br/>
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

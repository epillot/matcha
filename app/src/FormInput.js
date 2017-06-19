import React from 'react';
import './form.css';

const FormInput = props => (
  <p>
    <label htmlFor={props.name}>{props.name}: </label>
    <input
      type={props.type}
      name={props.name}
      value={props.value}
      className={props.error ? 'err_input' : ''}
    ></input>
    <span className='err_msg'>{props.error}</span>
  </p>
);

export default FormInput;

import React from 'react';
import TextField from 'material-ui/TextField';
import './form.css';

// const FormInput = props => (
//   <p>
//     <label htmlFor={props.name}>{props.name}: </label>
//     <input
//       type={props.type}
//       name={props.name}
//       value={props.value}
//       className={props.error ? 'err_input' : ''}
//     ></input>
//     <span className='err_msg'>{props.error}</span>
//   </p>
// );

const FormInput = props => (
  <div>
    <TextField
      value={props.value}
      name={props.name}
      floatingLabelText={props.label || props.name}
      type={props.type}
      errorText={props.error}
      underlineShow={props.underlineShow}
      autoComplete="off"
    /><br />
  </div>
);

export default FormInput;

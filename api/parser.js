/**
** Module for ckecking format of user inputs
**/

//Check if firstname or lastname are well formated
const nameField = (name, field) => {
  if (name === '' || name === undefined) {
    return {[field]: 'This field is required'};
  }
  if (!name.match(/^[a-zA-Z]{2,32}$/)) {
    return {[field]: 'This field must contain between 2 and 32 characters and only letters'};
  }
  return null;
}

//Check if login is well formated
const loginField = (login) => {
  if (login === '' || login === undefined) {
    return {login: 'This field is required'};
  }
  if (!login.match(/^[a-zA-Z0-9]{2,16}$/)) {
    return {login: 'This field must contain between 2 and 16 characters and only letters or digits'};
  }
  return null;
}

//Check if password is well formated
const passwordFields = (password, confirmPassword) => {
  let err = {};
  if (password === '' || password === undefined) {
    Object.assign(err, {password: 'This field is required'});
  }
  if (confirmPassword === '' || confirmPassword === undefined) {
    Object.assign(err, {confirmPassword: 'This field is required'});
  }
  if (err.password !== undefined) {
    return err;
  }
  if (!password.match(/(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/)) {
    Object.assign(err, {password: 'Password must contain at least 8 characters, 1 letter and 1 digit'});
    return err;
  }
  if (password !== confirmPassword) {
    return {
      password: 'Passwords are not identicals',
      confirmPassword: 'Passwords are not identicals'
    };
  }
  return null;
}

//Check if email is well formated
const emailField = (email) => {
  if (email === '' || email === undefined) {
    return {email: 'This field is required'};
  }
  if (email.length > 320 || !email.match(/^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/)) {
    return {email: 'Your email is invalid'};
  }
  return null;
}

//Performs all verifications for inputs signup form, return an object containing each error
const signup = (input) => {
  return (
    Object.assign({},
        nameField(input.firstname, 'firstname'),
        nameField(input.lastname, 'lastname'),
        loginField(input.login),
        passwordFields(input.password, input.confirmPassword),
        emailField(input.email))
  );
}

export default { signup };

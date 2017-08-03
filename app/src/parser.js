/**
** Module for ckecking format of user inputs
**/

//Check if firstname or lastname are well formated
const nameField = (name, field) => {
  if (name === '' || name === undefined) {
    return {[field]: 'This field is required'};
  }
  if (!name.match(/^[a-zA-Z]{2,32}$/)) {
    return {[field]: 'Name must contain between 2 and 32 characters and only letters'};
  }
  return null;
}

//Check if login is well formated
const loginField = (action, login) => {
  if (login === '' || login === undefined) {
    return {login: 'This field is required'};
  }
  if (action === 'signup' && !login.match(/^[a-zA-Z0-9]{2,16}$/)) {
    return {login: 'Login must contain between 2 and 16 characters and only letters or digits'};
  }
  return null;
}

//Check if password is well formated
const passwordFields = (action, password, confirmPassword) => {
  const err = {};
  if (password === '' || password === undefined) {
    err.password = 'This field is required';
  }
  if (action === 'signin') return err;
  if (confirmPassword === '' || confirmPassword === undefined) {
    err.confirmPassword = 'This field is required';
  }
  if (err.password !== undefined) return err;
  if (!password.match(/(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/)) {
    err.password = 'Password must contain at least 8 characters, 1 letter and 1 digit';
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

const keyField = (key) => {
  if (key === '' || key === undefined) {
    return {key: 'This field is required'};
  }
  if (!key.match(/^[a-zA-Z0-9]{16}$/)) {
    return {key: 'Invalid key'};
  }
}

const sexField = (sex) => {
  if (sex !== 1 && sex !== 2) {
    return {sexValue: 'This field is required'};
  }
}

//Performs all verifications for inputs signup form, return an object containing each error
const signup = (input) => {
  return (
    Object.assign({},
      nameField(input.firstname, 'firstname'),
      nameField(input.lastname, 'lastname'),
      sexField(input.sexValue),
      loginField('signup', input.login),
      passwordFields('signup', input.password, input.confirmPassword),
      emailField(input.email))
  );
}

const signin = (input) => {
  return (
    Object.assign({},
      loginField('signin', input.login),
      passwordFields('signin', input.password))
  );
}

const activation = (input) => {
  return (
    Object.assign({},
      loginField('activation', input.login),
      keyField(input.key))
  );
}

export default { signup, signin, activation };

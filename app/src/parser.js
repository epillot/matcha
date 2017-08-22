const parser = {

  firstname: function(value) {
    if (!value.match(/^[a-zA-Z]{2,32}$/)) {
      return 'Name must contain between 2 and 32 characters and only letters';
    }
    return null;
  },

  lastname: function(value) {
    if (!value.match(/^[a-zA-Z]{2,32}$/)) {
      return 'Name must contain between 2 and 32 characters and only letters';
    }
    return null;
  },

  login: function(value) {
    if (!value.match(/^[a-zA-Z0-9]{2,16}$/)) {
      return 'Login must contain between 2 and 16 characters and only letters or digits';
    }
    return null;
  },

  password: function(value) {
    if (!value.match(/(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/)) {
      return 'Password must contain at least 8 characters, 1 letter and 1 digit';
    }
    return null;
  },

  email: function(value) {
    if (value.length > 320 || !value.match(/^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/)) {
      return 'Your email is invalid';
    }
    return null;
  },

  key: function(value) {
    if (!value.match(/^[a-zA-Z0-9]{16}$/)) return 'Invalid key';
    return null;
  },

  sexValue: function(value) {
    if (value !== 1 && value !== 2) return 'Invalid sex value';
    return null;
  },

  bio: function(value) {
    if (value.length > 400) return 'Text too long';
    return null;
  }

};

export function signupParser(input) {
  const errors = {};
  let error;

  if (!input.firstname) errors.firstname = 'This field is required';
  else {
    error = parser.firstname(input.firstname)
    if (error) errors.firstname = error;
  }

  if (!input.lastname) errors.lastname = 'This field is required';
  else {
    error = parser.lastname(input.lastname)
    if (error) errors.lastname = error;
  }

  if (!input.sexValue) errors.sexValue = 'This field is required';
  else {
    error = parser.sexValue(input.sexValue)
    if (error) errors.sexValue = error;
  }

  if (!input.login) errors.login = 'This field is required';
  else {
    error = parser.login(input.login)
    if (error) errors.login = error;
  }

  if (!input.email) errors.email = 'This field is required';
  else {
    error = parser.email(input.email)
    if (error) errors.email = error;
  }

  if (!input.password) errors.password = 'This field is required';
  else {
    error = parser.password(input.password)
    if (error) errors.password = error;
  }

  if (!errors.password && input.password !== input.confirmPassword) {
    errors.password = 'Passwords are not identicals';
    errors.confirmPassword = 'Passwords are not identicals';
  }
  return errors;
};

export function signinParser(input) {
  const errors = {};

  if (!input.login) errors.login = 'This field is required';
  else if (parser.login(input.login)) errors.login = 'Login not found';
  if (errors.login) return errors;

  if (!input.password) errors.password = 'This field is required';
  else if (parser.password(input.password)) errors.password = 'Invalid Password';
  return errors;
};

export function activationParser(input) {
  const errors = {};
  let error;

  if (!input.login) errors.login = 'This field is required';
  else if (parser.login(input.login)) errors.login = 'Login not found';
  if (errors.login) return errors;

  if (!input.key) errors.key = 'This field is required';
  else {
    error = parser.key(input.key)
    if (error) errors.key = error;
  }
  return errors;
}

export default parser;

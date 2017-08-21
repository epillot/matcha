const parser = {

  name: function(value) {
    if (!value) return 'This field is required';
    if (!value.match(/^[a-zA-Z]{2,32}$/)) {
      return 'Name must contain between 2 and 32 characters and only letters';
    }
    return null;
  },

  login: function(value) {
    if (!value) return 'This field is required';
    if (!value.match(/^[a-zA-Z0-9]{2,16}$/)) {
      return 'Login must contain between 2 and 16 characters and only letters or digits';
    }
    return null;
  },

  password: function(value) {
    if (!value) return 'This field is required';
    if (!value.match(/(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/)) {
      return 'Password must contain at least 8 characters, 1 letter and 1 digit';
    }
    return null;
  },

  email: function(value) {
    if (!value) return 'This field is required';
    if (value.length > 320 || !value.match(/^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/)) {
      return 'Your email is invalid';
    }
    return null;
  },

  key: function(value) {
    if (!value) return 'This field is required';
    if (!value.match(/^[a-zA-Z0-9]{16}$/)) {
      return 'Invalid key';
    }
    return null;
  },

  sex: function(value) {
    if (value !== 1 && value !== 2) return 'This field is required';
    return null;
  },

};

export const signupParser = function(input) {
  const errors = {};
  let error;
  if (error = parser.name(input.firstname)) errors.firstname = error;
  if (error = parser.name(input.lastname)) errors.lastname = error;
  if (error = parser.sex(input.sexValue)) errors.sexValue = error;
  if (error = parser.login(input.login)) errors.login = error;
  if (error = parser.email(input.email)) errors.email = error;
  if (error = parser.password(input.password)) errors.password = error;
  if (!errors.password && input.password !== input.confirmPassword) {
    errors.password = 'Passwords are not identicals';
    errors.confirmPassword = 'Passwords are not identicals';
  }
  return errors;
};

export default parser;

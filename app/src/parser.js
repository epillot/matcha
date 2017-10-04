const parser = {

  firstname: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    if (!value.match(/^[a-zA-Z-éè ]{2,32}$/)) {
      return 'Name must contain between 2 and 32 characters and only letters, space or \'-\'';
    }
    return null;
  },

  lastname: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    if (!value.match(/^[a-zA-Z-éè ]{2,32}$/)) {
      return 'Name must contain between 2 and 32 characters and only letters, space or \'-\'';
    }
    return null;
  },

  login: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    if (!value.match(/^[a-zA-Z0-9]{2,16}$/)) {
      return 'Login must contain between 2 and 16 characters and only letters or digits';
    }
    return null;
  },

  password: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    if (!value.match(/(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/)) {
      return 'Password must contain at least 8 characters, 1 letter and 1 digit';
    }
    return null;
  },

  email: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    if (value.length > 320 || !value.match(/^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/)) {
      return 'Your email is invalid';
    }
    return null;
  },

  key: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    if (!value.match(/^[a-zA-Z0-9]{16}$/)) return 'Invalid key';
    return null;
  },

  sexValue: function(value) {
    if (value !== 1 && value !== 2) return 'Invalid value';
    return null;
  },

  birthday: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    const date = new Date(value);
    if (date.toString() === 'Invalid Date') return 'Invalid birth date';
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    if (age < 18 || age > 100) return 'Invalid birth date';
    return null;
  },

  lookingFor: function(value) {
    if (value !== 1 && value !== 2 && value !== 3) return 'Invalid value'
    return null;
  },

  bio: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    if (value.length > 400) return 'Text too long';
    return null;
  },

  loc: function(value) {
    if (typeof value !== 'object') return 'invalid value';
    const keys = Object.keys(value);
    if (keys.length !== 2 || keys[0] !== 'type' || keys[1] !== 'coordinates') {
      return 'invalid value';
    }
    const { type, coordinates } = value;
    if (type !== 'Point') return 'invalid type value';
    if (!Array.isArray(coordinates)) return 'invalid coordinates value';
    if (coordinates.length !== 2) return 'invalid coordinates value';
    const [ lng, lat ] = coordinates;
    if (+lng < -180 || +lng > 180) return 'invalid longitude value';
    if (+lat < -90 || +lat > 90) return 'invalid latitude value';
    return null;
  },

  adress: function(value) {
    if (typeof value !== 'string') return 'Invalid value';
    if (value === '') return 'Empty adress';
    if (value.length > 200) return 'Adress too long';
  },

};

export function signupParser(input) {
  const errors = {};
  let error;
  const fields = [
    'firstname',
    'lastname',
    'sexValue',
    'login',
    'email',
    'birthday',
    'password',
  ];
  fields.forEach(field => {
    if (!input[field]) errors[field] = 'Required';
    else {
      error = parser[field](input[field]);
      if (error) errors[field] = error;
    }
  });
  if (!errors.password && input.password !== input.confirmPassword) {
    errors.password = 'Passwords are not identicals';
    errors.confirmPassword = 'Passwords are not identicals';
  }
  return errors;

}

export function signinParser(input) {
  const errors = {};

  if (!input.login) errors.login = 'Required';
  else if (parser.login(input.login)) errors.login = 'Login not found';

  if (!input.password) errors.password = 'Required';
  else if (parser.password(input.password)) errors.password = 'Invalid Password';
  return errors;
};

export function activationParser(input) {
  const errors = {};
  let error;

  if (!input.login) errors.login = 'Required';
  else if (parser.login(input.login)) errors.login = 'Login not found';
  if (errors.login) return errors;

  if (!input.key) errors.key = 'Required';
  else {
    error = parser.key(input.key)
    if (error) errors.key = error;
  }
  return errors;
}

export function editPasswordParser(input) {
  const { password, newPassword, confirmPassword } = input;
  const errors = {};
  let error;

  if (!password) errors.password = 'Required';
  else if (parser.password(password)) errors.password = 'Invalid password';

  if (!confirmPassword) errors.confirmPassword = 'required';

  if (!newPassword) errors.newPassword = 'required';
  else {
    error = parser.password(newPassword);
    if (error) errors.newPassword = error;
  }

  if (errors.password || errors.newPassword) return errors;

  if (password === newPassword) {
    errors.newPassword = 'Passwords are identicals';
    errors.password = 'Passwords are identicals';
    return errors;
  }

  if (newPassword !== confirmPassword) {
    errors.newPassword = 'Passwords are not identicals';
    errors.confirmPassword = 'Passwords are not identicals';
  }
  return errors;
}

export default parser;

import parser from './parser';
import bcrypt from 'bcrypt';
import mailer from './mailer';
import jwt from 'jsonwebtoken';

const getSignupErrors = async (input) => {
  const err = parser.signup(input);
  if (Object.keys(err).length !== 0) return err;

  const { login, email } = input;
  let user = await db.collection('Users').findOne({login});
  if (user) {
    err.login = 'This login is not availaible, please choose an other';
    return err;
  }
  user = await db.collection('Users').findOne({email});
  if (user) {
    err.email = 'This email was already used for signup, please use an other';
  }
  return err;
}

const getSigninErrors = async (input) => {
  const err = parser.signin(input);
  if (Object.keys(err).length !== 0) return err;

  const { login, password } = input;
  const user = await db.collection('Users').findOne({login});
  if (!user) {
    err.login = 'There is no user with this login';
    return err;
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    err.password = 'Invalid password';
    return err;
  }
  if (!user.active) err.login = 'Your account is not active';
  return err;
}

const getActivationErrors = async (input) => {
  const err = parser.activation(input);
  if (Object.keys(err).length !== 0) return err;

  const user = await db.collection('Users').findOne({login: input.login});
  if (!user) {
    err.login = 'There is no user with this login';
    return err;
  }
  if (user.active) {
    err.login = 'Your account is already active';
    return err;
  }
  if (input.key !== user.key) err.key = 'Invalid key';
  return err;
}

const activationKey = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 16; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

const signup = async (req, res) => {
  try {
    const err = await getSignupErrors(req.body);
    if (Object.keys(err).length === 0) {
      const hash = await bcrypt.hash(req.body.password, 10);
      const key = activationKey();
      const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        login: req.body.login,
        password: hash,
        email: req.body.email,
        key: key,
        active: false
      };
      const mail = mailer.createConfirmationMail(user.firstname, key);
      mailer.sendMail(user.email, 'Confirm your inscription to Matcha', mail['txt'], mail['html']);
      db.collection('Users').insertOne(user);
    }
    res.send(err);
  } catch (e) { console.log(e) }
}

const signin = async (req, res) => {
  try {
    const response = await getSigninErrors(req.body);
    if (Object.keys(response).length === 0) {
      response.token = jwt.sign( {login: req.body.login}, config.jwtSecret, {expiresIn: '60 days'} );
    }
    res.send(response);
  } catch (e) { console.log(e) }
}

const activation = async (req, res) => {
  try {
    const err = await getActivationErrors(req.body);
    if (Object.keys(err).length === 0) {
      db.collection('Users').updateOne({login: req.body.login}, { $set: { active: true } });
    }
    res.send(err);
  } catch (e) { console.log(e) }
}

const auth = (req, res) => {
  res.sendStatus(200);
}

const myprofile = async (req, res) => {
  const { login } = req.user;
  try {
    const profile = await db.collection('Users').findOne({login}, {
      _id: 0,
      firstname: 1,
      lastname: 1,
      login: 1,
      email: 1
    });
    res.send(profile);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export default { signup, signin, activation, auth, myprofile }

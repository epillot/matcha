import parser from './parser';
import mongoDb from './Database';
import bcrypt from 'bcrypt';
import mailer from './mailer';
import jwt from 'jsonwebtoken';
import { jwtSecret } from './config/config';

//const mongoDb2 = Database();

const getSignupErrors = async (input) => {
  const err = parser.signup(input);

  if (err.login === undefined && await mongoDb.users.findOne({login: input.login}) !== null) {
      Object.assign(err, {login: 'This login is not availaible, please choose an other'});
  }

  if (err.email === undefined && await mongoDb.users.findOne({email: input.email}) !== null) {
      Object.assign(err, {email: 'This email was already used for signup, please use an other'});
  }
  return err;
}

const getSigninErrors = async (input) => {
  const err = parser.signin(input);

  if (err.login === undefined) {
    const user = await mongoDb.users.findOne({login: input.login});
    if (!user) {
      err.login = 'There is no user with this login';
    }
    else if (err.password === undefined) {
      const auth = await bcrypt.compare(input.password, user.password);
      if (!auth) {
        err.password = 'Invalid password';
      }
      else if (!user.active) {
        err.login = 'Your account is not active';
      }
    }
  }
  return err;
}

const getActivationErrors = async (input) => {
  const err = parser.activation(input);

  if (err.login === undefined) {
    const user = await mongoDb.users.findOne({login: input.login});
    if (!user) {
      err.login = 'There is no user with this login';
    }
    else if (user.active) {
        err.login = 'Your account is already active';
    }
    else if (err.key === undefined) {
      if (input.key !== user.key) {
        err.key = 'Invalid key';
      }
    }
  }
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
      mongoDb.users.insertOne(user);
    }
    res.send(err);
  } catch (e) { console.log(e) }
}

const signin = async (req, res) => {
  try {
    const response = await getSigninErrors(req.body);
    if (Object.keys(response).length === 0) {
      response.token = jwt.sign( {user: req.body.login}, jwtSecret, {expiresIn: '60 days'} );
    }
    res.send(response);
  } catch (e) { console.log(e) }
}

const activation = async (req, res) => {
  try {
    const err = await getActivationErrors(req.body);
    if (Object.keys(err).length === 0) {
      mongoDb.users.updateOne({login: req.body.login}, { $set: { active: true } });
    }
    res.send(err);
  } catch (e) { console.log(e) }
}

const auth = (req, res) => {
  const token = req.body.token;
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) res.send({auth: false});
    else res.send({auth: true, user: decoded.user})
  })
}

export default { signup, signin, activation, auth }

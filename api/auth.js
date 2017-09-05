import { signupParser, signinParser, activationParser } from './parser';
import bcrypt from 'bcrypt';
import mailer from './mailer';
import jwt from 'jsonwebtoken';

const activationKey = function() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 16; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

export default {

  signup: async function(req, res) {
    try {
      const errors = signupParser(req.body);
      if (Object.keys(errors).length !== 0) return res.send(errors);
      const { firstname, lastname, sexValue, birthday, login, email, password } = req.body;
      let user;
      if (user = await db.collection('Users').findOne({login})) {
        return res.send({login: 'This login is not availaible, please choose an other'});
      }
      if (user = await db.collection('Users').findOne({email})) {
        return res.send({email: 'This email was already used for signup, please use an other'});
      }
      const hash = await bcrypt.hash(password, 10);
      const key = activationKey();
      user = {
        firstname,
        lastname,
        sexValue,
        birthday,
        lookingFor: 3,
        login,
        password: hash,
        email,
        pictures: [],
        tags: [],
        bio: '',
        key,
        active: false
      };
      const mail = mailer.createConfirmationMail(user.firstname, key);
      mailer.sendMail(user.email, 'Confirm your inscription to Matcha', mail['txt'], mail['html']);
      db.collection('Users').insertOne(user);
      res.sendStatus(201);

    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  signin: async function(req, res) {
    try {
      const errors = signinParser(req.body);
      if (Object.keys(errors).length !== 0) return res.send(errors);
      const { login, password } = req.body;
      const user = await db.collection('Users').findOne({login});
      if (!user) return res.send({login: 'Login not found'});
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) return res.send({password: 'Invalid password'});
      if (!user.active) return res.send({login: 'Your account is not active'});
      const response = {
        token: jwt.sign({id: user._id}, config.jwtSecret, {expiresIn: '60 days'}),
        user: user._id,
      };
      res.send(response);

    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  activation: async function(req, res) {
    try {
      const errors = activationParser(req.body);
      if (Object.keys(errors).length !== 0) return res.send(errors);
      const { login, key } = req.body;
      const user = await db.collection('Users').findOne({login});
      if (!user) return res.send({login: 'Login not found'});
      if (user.active) return res.send({login: 'Your account is already active'});
      if (key !== user.key) return res.send({key: 'Invalid key'});
      db.collection('Users').updateOne({login}, {$set: {active: true}});
      res.send({});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  get: function(req, res) {
    res.send(req.user.id);
  }

};

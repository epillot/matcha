import parser, { signupParser, signinParser, activationParser } from './parser';
import bcrypt from 'bcrypt';
import mailer from './mailer';
import jwt from 'jsonwebtoken';
import ipInfo from 'ipinfo';
import axios from 'axios';

const activationKey = function() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 16; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

const getRdmPw = function() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let pw = '';
  for (let i = 0; i < 6; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 3; i++) {
    pw += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return pw;
};

const getLocation = function() {
  return new Promise((resolve, reject) => {
    ipInfo((err, cloc) =>{
      if (err) reject(err);
      resolve(cloc.loc);
    });
  });
};

const getAdress = function(latlng) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=AIzaSyDE0o19-BhBWjMrmbPHrHVTTttfWHFeRyI';
  return new Promise((resolve, reject) => {
    axios.get(url).then(({ data }) => {
      resolve(data.results[1].formatted_address);
    }).catch(err => reject(err));
  });
}

export default {

  signup: async function(req, res) {
    if (!req.body) return res.status(400).send('Empty request');
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
      const latlng = await getLocation();
      const [ lat, lng ] = latlng.split(',');
      const coordinates = [+lng, +lat];
      const type = 'Point';
      const adress = await getAdress(latlng);
      const loc = {type, coordinates};
      user = {
        firstname,
        lastname,
        sexValue,
        birthday: new Date(birthday),
        lookingFor: 3,
        login,
        password: hash,
        email,
        pictures: [],
        tags: [],
        bio: '',
        loc,
        adress,
        ts: Date.now(),
        like: {
          to: [],
          from: [],
        },
        block: [],
        report: [],
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
    if (!req.body) return res.status(400).send('Empty request');
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
    if (!req.body) return res.status(400).send('Empty request');
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

  resetPassword: async function(req, res) {
    if (!req.body) return res.status(400).send('Empty request');
    try {
      const { email } = req.body;
      const error = parser.email(email);
      if (error) return res.send({error});
      const user = await db.collection('Users').findOne({email});
      if (!user) return res.send({error: 'Email not found'});
      const newPassword = getRdmPw();
      const hash = await bcrypt.hash(newPassword, 10);
      const mail = mailer.createResetPwMail(user.login, newPassword);
      mailer.sendMail(email, 'Reset your Matcha password', mail['txt'], mail['html']);
      db.collection('Users').updateOne({email}, {$set: {password: hash}});
      res.send({error: ''});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  get: function(req, res) {
    res.send(req.user.id);
  }

};

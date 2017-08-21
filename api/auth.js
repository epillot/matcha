import parser, { signupParser } from './parser2';
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
        sex: sexValue === 1 ? 'M' : 'W',
        birthday,
        lookingFor: 'Both',
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

};

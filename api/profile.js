import parser, { editPasswordParser } from './parser';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const validFields = [
  'firstname',
  'lastname',
  'sexValue',
  'birthday',
  'lookingFor',
  'login',
  'email',
  'bio',
];

const profileToSend = {
  _id: 0,
  firstname: 1,
  lastname: 1,
  sexValue: 1,
  birthday: 1,
  lookingFor: 1,
  login: 1,
  pictures: 1,
  profilePic: 1,
  tags: 1,
  bio: 1,
  loc: 1,
};

export default {

  get: async function(req, res) {
    const { params: { id }, user: { id: idCurrentUser } } = req;
    let _id;
    if (id === idCurrentUser) profileToSend.email = 1;
    try { _id = ObjectId(id) }
    catch (e) { return res.send({error: 'No profile found'}) }
    try {
      const profile = await db.collection('Users').findOne({_id}, profileToSend);
      if (!profile) return res.send({error: 'No profile found'});
      res.send({profile});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  patch: async function(req, res) {
    const { params: { id }, user: { id: idCurrentUser }, body: { action, data } } = req;
    if (id !== idCurrentUser) {
      return res.status(401).send({error: 'Not allowed to update this profile'});
    }
    try {
      const users = db.collection('Users');
      const _id = ObjectId(id);
      const profile = await users.findOne({_id});
      let errors = {};
      switch (action) {

        case 'addTag':
          if (profile.tags.length > 5) {
            return res.send({error: 'You can\'t have more than 6 tags on your profile'});
          }
          if (typeof data !== 'string' || !data.match(/^[a-zA-Z0-9-$']{3,12}$/)) {
            return res.send({error: 'Invalid tag'});
          }
          if (profile.tags.indexOf(data) !== -1) {
            return res.send({error: 'This tag is already active on your profile'});
          }
          users.updateOne({_id}, {$push: {tags: data}});
          res.end();
          break;

        case 'delTag':
          if (profile.tags.indexOf(data) === -1) {
            return res.status(400).send('Tag not found on your profile');
          }
          users.updateOne({_id}, {$pull: {tags: data}});
          res.end();
          break;

        case 'setProfilePic':
          if (profile.pictures.indexOf(data) === -1) {
            return res.status(400).send('Picture not found on your profile');
          }
          users.updateOne({_id}, {$set: {profilePic: data}});
          res.end();
          break;

        case 'editPassword':
          errors = editPasswordParser(data);
          if (Object.keys(errors).length !== 0) return res.send(errors);
          const auth = await bcrypt.compare(data.password, profile.password);
          if (!auth) return res.send({password: 'Invalid password'});
          const password = await bcrypt.hash(data.newPassword, 10);
          users.updateOne({_id}, {$set: {password}});
          res.end();
          break;

        case 'editInfo':
          const update = {};
          let unavailable;
          data.forEach(edit => {
            let { field, value } = edit;
            let error;
            if (validFields.indexOf(field) === -1) {
              throw 'Invalid request';
            }
            if (typeof value === 'string') value = value.trim();
            if (field === 'bio') value = value.replace(/[\n ]+/g, ' ');
            if (error = parser[field](value)) errors[field] = error;
            else update[field] = value;
          });
          if (Object.keys(errors).length === 0) {
            if (update.login) {
              unavailable = await users.findOne({login: update.login})
              if (unavailable) errors.login = 'This login is not available';
            }
            if (update.email) {
              unavailable = await users.findOne({email: update.email})
              if (unavailable) errors.email = 'This email is already use';
            }
          }
          console.log('update', update);
          console.log('errors', errors);
          if (Object.keys(errors).length === 0) users.updateOne({_id}, {$set: update});
          res.send(errors);
          break;

        default:
          res.status(401).send('invalid action requested');

      }
    } catch (e) {
      if (e === 'Invalid request') return res.status(400).send(e);
      console.log(e);
      res.sendStatus(500);
    }
  },

};

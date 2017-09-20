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
  _id: 1,
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
  ts: 1,
};

export default {

  get: async function(req, res) {
    const {
      params: { id: idTarget },
      user: {
        id: idCurrentUser,
        profile: currentUser,
      },
    } = req;
    let _id;
    if (idTarget === idCurrentUser) profileToSend.email = 1;
    try { _id = ObjectId(idTarget) }
    catch (e) { return res.send({error: 'No profile found'}) }
    try {
      const toSend = await db.collection('Users').findOne({_id}, profileToSend);
      if (!toSend) return res.send({error: 'No profile found'});
      if (currentUser.like.to.indexOf(idTarget) !== -1) {
        toSend.liked = true;
      } else toSend.liked = false;
      if (currentUser.block.indexOf(idTarget) !== -1) {
        toSend.blocked = true;
      } else toSend.blocked = false;
      if (currentUser.report.indexOf(idTarget) !== -1) {
        toSend.reported = true;
      } else toSend.reported = false;
      if (ioServer.isLogged(idTarget)) toSend.logged = true;
      res.send({profile: toSend});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  patch: async function(req, res) {
    const {
      params: { id },
      user: { id: idCurrentUser, profile },
      body: { action, data },
    } = req;
    if (id !== idCurrentUser) {
      return res.status(401).send({error: 'Not allowed to update this profile'});
    }
    try {
      const users = db.collection('Users');
      const _id = ObjectId(id);
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

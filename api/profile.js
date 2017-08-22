import parser from './parser';

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
  sex: 1,
  birthday: 1,
  lookingFor: 1,
  login: 1,
  email: 1,
  pictures: 1,
  profilePic: 1,
  tags: 1,
  bio: 1,
};

export default {

  get: async function(req, res) {
    const { params: { login }, user: { login: currentUser } } = req;
    if (login === currentUser) profileToSend.email = 1;
    try {
      const profile = await db.collection('Users').findOne({login}, profileToSend);
      if (!profile) return res.send({error: 'No profile found'});
      res.send(profile);
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  patch: async function(req, res) {
    const { params: { login }, user: { login: currentUser }, body: { action, data } } = req;
    console.log(currentUser);
    if (login !== currentUser) {
      return res.status(401).send({error: 'Not allowed to update this profile'});
    }
    try {
      const users = db.collection('Users');
      const profile = await users.findOne({login});
      switch (action) {

        case 'addTag':
          if (profile.tags.length > 5) {
            return res.send({error: 'You can\'t have more than 6 tags on your profile'});
          }
          if (!data.match(/^[a-zA-Z0-9-$']{3,12}$/)) {
            return res.send({error: 'Invalid tag'});
          }
          if (profile.tags.indexOf(data) !== -1) {
            return res.send({error: 'This tag is already active on your profile'});
          }
          users.updateOne({login}, {$push: {tags: data}});
          res.end();
          break;

        case 'delTag':
          users.updateOne({login}, {$pull: {tags: data}});
          res.end();
          break;

        case 'setProfilePic':
          if (profile.pictures.indexOf(data) === -1) {
            return res.status(401).send('Picture not found on your profile');
          }
          users.updateOne({login}, {$set: {profilePic: data}});
          res.end();
          break;

        case 'editInfo':
          const update = {};
          const errors = {};
          console.log('data', data);
          let unavailable;
          data.forEach(edit => {
            let { field, value } = edit;
            let error;
            if (field === 'bio') value = value.replace(/[\n ]+/g, ' ');
            if (validFields.indexOf(field) === -1) {
              throw 'Invalid request';
            }
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
          if (Object.keys(errors).length === 0) users.updateOne({login}, {$set: update});
          res.send(errors);
          break;

        default:
          res.status(401).send('invalid action requested');

      }
    } catch (e) {
      if (e === 'Invalid request') return res.status(401).send(e);
      console.log(e);
      res.sendStatus(500);
    }
  },

};

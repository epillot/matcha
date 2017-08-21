const validFields = [
  'firstname',
  'lastname',
  'sex',
  'birthday',
  'lookingFor',
  'login',
  'email',
  'profilePic',
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
          users.updateOne({login}, {$set: {profilePic: data}});
          res.end();
          break;

        case 'editBio':
          const bio = data.replace(/[\n ]+/g, ' ');
          if (bio.length > 400) {
            return res.send({error: 'Text too long'});
          }
          users.updateOne({login}, {$set: {bio}});
          res.end();
          break;

        case 'editInfo':
          data.forEach(edit => {
            switch (edit.field) {
              case firstname:

                break;
              default:

            }
          })

        default:

      }
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

};

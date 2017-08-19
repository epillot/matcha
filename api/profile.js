
export default {

  get: async function(req, res) {
    const { params: { login }, user: { login: currentUser } } = req;
    try {
      const profile = await db.collection('Users').findOne({login}, {
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
      });
      if (!profile) return res.send({error: 'No profile found'});
      res.send(profile);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },

  patch: async function(req, res) {
    const { params: { login }, user: { login: currentUser }, body: { action, data } } = req;
    if (login !== currentUser) return res.send({error: 'Not allowed to update this profile'});
    const profile = await db.collection('Users').findOne({login});
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
        db.collection('Users').updateOne({login}, {$push: {tags: data}});
        res.end();
        break;

      case 'delTag':
        db.collection('Users').updateOne({login}, {$pull: {tags: data}});
        res.end();
        break;

      case 'setProfilePic':
        db.collection('Users').updateOne({login}, {$set: {profilePic: data}});
        res.end();
        break;

      default:

    }
  }

}

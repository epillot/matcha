import { ObjectId } from 'mongodb';

export default {

  get: async function(req, res) {
    const _id = ObjectId(req.user.id);
    const users = db.collection('Users');
    const ToSend = {
      _id: 1,
      firstname: 1,
      lastname: 1,
      sexValue: 1,
      birthday: 1,
      lookingFor: 1,
      login: 1,
      profilePic: 1,
      loc: 1,
    };
    try {
      const { lookingFor, sexValue } = await users.findOne({_id});
      const filter = {
        _id: {$ne: _id},
        active: true,
      };
      if (lookingFor !== 3) filter.sexValue = lookingFor;
      filter.lookingFor = {$in: [sexValue, 3]};
      const matchs = await users.find(filter, ToSend).toArray();
      res.send(matchs)
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

}

import { ObjectId } from 'mongodb';

export default {

  get: async function(req, res) {
    const _id = ObjectId(req.user.id);
    const users = db.collection('Users');
    try {
      const { notif } = await users.findOne({_id});
      users.update({_id, 'notif.read': false}, {$set: {'notif.$.read': true}}, {multi: true})
      res.send({notif: notif || []});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  getCount: async function(req, res) {
    const _id = ObjectId(req.user.id);
    const users = db.collection('Users');
    try {
      const { notif } = await users.findOne({_id});
      let count = 0;
      if (!notif) return res.send({count})
      notif.forEach(n => {
        if (!n.read) count++;
      });
      return res.send({count});
    } catch (e) { console.log(e); res.sendStatus(500) }
  }
}

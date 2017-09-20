import { ObjectId } from 'mongodb';

export default {

  get: async function(req, res) {
    const to = req.user.id;
    const Notifs = db.collection('notifs');
    try {
      const notif = await Notifs.find({to}).toArray();
      res.send({notif});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  getUnread: async function(req, res) {
    const to = req.user.id;
    const Notifs = db.collection('notifs');
    try {
      const notifUnread = await Notifs.find({to, read: false}).toArray();
      res.send({notifUnread});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  post: async function(req, res) {
    if (!req.body) return res.status(400).send('Empty request');
    const { body: { to, object }, user: { id } } = req;
    if (['visit', 'like', 'message', 'unlike', 'match'].indexOf(object) === -1) {
      return res.status(400).send('Invalid notification object');
    }
    let idTo;
    try {
      idTo = ObjectId(to);
    } catch (e) { return res.status(400).send('Invalid target id') }
    try {
      const profileTo = await db.collection('Users').findOne({_id: idTo});
      if (!profileTo) {
        return res.status(400).send('trying to send notification to a non-existent user');
      }
      if (profileTo.block.indexOf(id) !== -1) return res.end();
      const idFrom = ObjectId(id);
      const profileFrom = await db.collection('Users').findOne({_id: idFrom});
      const notif = {
        to,
        from: {
          id,
          login: profileFrom.login,
          pp: profileFrom.profilePic,
        },
        object,
        read: false,
        ts: Date.now(),
      };
      await db.collection('notifs').insertOne(notif);
      res.sendStatus(201);
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  delete: async function(req, res) {
    let _id;
    try {
      _id = ObjectId(req.params.id);
    } catch (e) { return res.status(400).send('invalid request') }
    const Notifs = db.collection('notifs');
    try {
      const notif = await Notifs.findOne({_id});
      if (!notif) return res.status(400).send('Notification does not exist');
      if (req.user.id !== notif.to) return res.status(401).send('Not allowed to delete this notification');
      await Notifs.deleteOne({_id});
      res.end();
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  setAsRead: async function(req, res) {
    const to = req.user.id;
    const Notifs = db.collection('notifs');
    try {
      await Notifs.update({to, read: false}, {$set: {read: true}}, {multi: true});
      res.end();
    } catch (e) { console.log(e); res.sendStatus(500) }
  },
}

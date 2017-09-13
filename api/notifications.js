import { ObjectId } from 'mongodb';

export default {

  get: async function(req, res) {
    const to = ObjectId(req.user.id);
    const Notifs = db.collection('notifs');
    try {
      const notif = await Notifs.find({to}).toArray();
      res.send({notif});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  getUnread: async function(req, res) {
    const to = ObjectId(req.user.id);
    const Notifs = db.collection('notifs');
    try {
      const notifUnread = await Notifs.find({to, read: false}).toArray();
      res.send({notifUnread});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  delete: async function(req, res) {
    try {
      var _id = ObjectId(req.params.id);
    } catch (e) { return res.status(400).send('invalid request') }
    const Notifs = db.collection('notifs');
    try {
      const notif = await Notifs.findOne({_id});
      if (!notif) return res.status(400).send('Notification does not exist');
      if (req.user.id !== notif.to.toString()) return res.status(401).send('Not allowed to delete this notification');
      Notifs.deleteOne({_id});
      res.sendStatus(202);
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  setAsRead: async function(req, res) {
    const to = ObjectId(req.user.id);
    const Notifs = db.collection('notifs');
    try {
      await Notifs.update({to, read: false}, {$set: {read: true}}, {multi: true});
      res.end();
    } catch (e) { console.log(e); res.sendStatus(500) }
  }
}


/***

current bugs ==>

- les notifs sont normalement marquees comme lues apres avoir ouvert le popover,
actuellement elles le sont uniquement apres une ouverture suite a une nouvelle notification recue via socket (state newNotif)

- notifs dupliquées dans le popover, ce bug est apparement une consequence du premier.


***/

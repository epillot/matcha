import { ObjectId } from 'mongodb';
import parser from './parser';

export default {

  getContacts: async function(req, res) {
    const { profile } = req.user;
    const queries = [];
    const fields = {
      _id: 1,
      login: 1,
      ts: 1,
      profilePic: 1,
    };
    try {
      profile.like.to.forEach(id => {
        if (profile.like.from.indexOf(id) !== -1) {
          queries.push(
            db.collection('Users').findOne({_id: ObjectId(id)}, fields)
          );
        }
      });
      const contacts = await Promise.all(queries);
      contacts.forEach(contact => {
        if (ioServer.isLogged(contact._id.toString())) contact.logged = true;
      })
      res.send({contacts});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  getConv: async function(req, res) {
    const {
      user: { profile, id: id1 },
      params: { id: id2 },
    } = req;
    if (profile.like.to.indexOf(id2) === -1 || profile.like.from.indexOf(id2) === -1) {
      return res.send({error: true});
    }
    const filter = {
      $and: [
        {idSender: {$in: [id1, id2]}},
        {idTarget: {$in: [id1, id2]}},
      ],
    };
    try {
      const conv = await db.collection('chat').find(filter).toArray();
      res.send({conv});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

  postMsg: async function(req, res) {
    if (!req.body) return res.status(400).send('Empty request');
    const {
      user: { profile: sender, id: idSender },
      body: { idTarget, message },
    } = req;
    let _id;
    try {
      _id = ObjectId(idTarget)
    } catch (e) { return res.status(400).send('Invalid target id') }
    const target = await db.collection('Users').findOne({_id});
    if (!target) return res.status(400).send('non existent target');
    if (sender.like.to.indexOf(idTarget) === -1 || sender.like.from.indexOf(idTarget) === -1) {
      return res.status(401).send('You don\'t have a match with the target');
    }
    const error = parser.message(message);
    if (error) return res.send({error});
    const ts = Date.now();
    const chatmsg = {
      idSender,
      idTarget,
      ts,
      content: message,
    };
    db.collection('chat').insertOne(chatmsg);
    res.status(201).send({chatmsg});
  }

}

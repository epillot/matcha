import { ObjectId } from 'mongodb'

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
  },

  getConv: async function(req, res) {
    const {
      user: { profile },
      params: { id }
    } = req;
  },

}

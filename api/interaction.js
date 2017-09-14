import { ObjectId } from 'mongodb';

export default {

  post: async function(req, res) {
    if (!req.body) return res.status(400).send('Empty request');
    const { body: { target, action }, user: { id } } = req;
    if (['like', 'block', 'report', 'unlike', 'unblock', 'unreport'].indexOf(action) === -1) {
      return res.status(400).send('Invalid interaction action');
    }
    let _id;
    try {
      _id = ObjectId(target);
    } catch (e) { return res.status(400).send('Invalid target id') }
    const Users = db.collection('Users');
    const targetProfile = await Users.findOne({_id});
    if (!targetProfile) return res.status(400).send('non-existent target');
    switch (action) {
      case 'like':
        if (targetProfile.likedBy.indexOf(id) !== -1) {
          return res.status(400).send('profile already liked')
        }
        Users.updateOne({_id}, {$push: {likedBy: id}});
        break;

      case 'block':
        if (targetProfile.likedBy.indexOf(id) !== -1) {
          return res.status(400).send('profile already liked')
        }
        Users.updateOne({_id}, {$push: {likedBy: id}});
        break;
      default:

    }
  }

}

import { ObjectId } from 'mongodb';

const handler = {

  like: async function(sender, target, res) {
    const Users = db.collection('Users');
    let dbUpdates = [];
    let operator = '$pull';
    let response = {status: 'unlike'}
    if (sender.profile.like.to.indexOf(target.id) === -1) {
      operator = '$push';
      if (target.profile.like.to.indexOf(sender.id) !== -1) {
        response.status = 'match';
      } else response.status = 'like';
    }
    dbUpdates.push(
      Users.updateOne(sender.filter, {[operator]: {'like.to': target.id}}),
      Users.updateOne(target.filter, {[operator]: {'like.from': sender.id}}),
    );
    await Promise.all(dbUpdates);
    res.send(response);
  },

  block: async function(sender, target, res) {
    const Users = db.collection('Users');
    let operator = '$push';
    if (sender.profile.block.indexOf(target.id) !== -1) {
      operator = '$pull';
    }
    await Users.updateOne(sender.filter, {[operator]: {block: target.id}});
    res.send({});
  },

  report: async function(sender, target, res) {
    const Users = db.collection('Users');
    let operator = '$push';
    if (sender.profile.report.indexOf(target.id) !== -1) {
      operator = '$pull';
    }
    await Users.updateOne(sender.filter, {[operator]: {report: target.id}});
    res.send({});
  },

}

export default async function(req, res) {

  if (!req.body) return res.status(400).send('Empty request');

  const { target: idTarget, action } = req.body;
  if (['like', 'block', 'report'].indexOf(action) === -1) {
    return res.status(400).send('Invalid action requested');
  }

  const target = {};

  try {
    target.filter = {_id : ObjectId(idTarget)}
  } catch (e) {
    return res.status(400).send('Invalid target id')
  }

  target.id = idTarget;
  const sender = req.user;
  if (sender.id === target.id) return res.status(400).send('Cannot interact with yourself');

  try {
    const Users = db.collection('Users');
    target.profile = await Users.findOne(target.filter);
    if (!target.profile) return res.status(400).send('non-existent target');
    sender.filter = {_id: ObjectId(sender.id)};
    handler[action](sender, target, res);
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
}

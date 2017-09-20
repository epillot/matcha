import { ObjectId } from 'mongodb';

// export default {
//
//   like: async function(req, res) {
//     if (!req.body) return res.status(400).send('Empty request');
//     const {
//       body: { target: idTarget },
//       user: { id: idSender, profile: sender },
//     } = req;
//     let _idTarget
//     try {
//       _idTarget = {_id : ObjectId(idTarget)}
//     } catch (e) { return res.status(400).send('Invalid target id') }
//     try {
//       const Users = db.collection('Users');
//       const target = await Users.findOne(_idTarget);
//       if (!target) return res.status(400).send('non-existent target');
//       const _idSender = {_id: ObjectId(idSender)};
//       let dbUpdates = [];
//       let response = {};
//       let action;
//       if (sender.like.indexOf(idTarget) === -1) action = '$push'
//       else {
//         action = '$pull';
//         response.status = 'unlike';
//       }
//       dbUpdates.push(Users.updateOne(_idSender, {[action]: {like: idTarget}}));
//       if (target.like.indexOf(idSender) !== -1) {
//         dbUpdates.push(
//           Users.updateOne(_idTarget, {[action]: {match: idSender}}),
//           Users.updateOne(_idSender, {[action]: {match: idTarget}})
//         );
//         if (action === '$push') response.status = 'match';
//       } else if (action === '$push') response.status = 'like';
//       await Promise.all(dbUpdates);
//       res.send(response);
//     } catch (e) { console.log(e); res.sendStatus(500) }
//   },
//
//   block: async function(req, res) {
//     if (!req.body) return res.status(400).send('Empty request');
//     const {
//       body: { target: idTarget, action },
//       user: { id: idSender, profile: sender },
//     } = req;
//     try {
//       _idTarget = {_id : ObjectId(idTarget)}
//     } catch (e) { return res.status(400).send('Invalid target id') }
//     try {
//       const Users = db.collection('Users');
//       const target = await Users.findOne(_idTarget);
//       if (!target) return res.status(400).send('non-existent target');
//       const _idSender = {_id: ObjectId(idSender)};
//       let action;
//       if (sender.like.indexOf(idTarget) === -1) action = '$push'
//       else action = '$pull';
//       Users.updateOne(_idSender, {[action]: {block: idTarget}});
//       res.end();
//   }
//
// }

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

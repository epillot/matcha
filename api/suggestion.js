import { ObjectId } from 'mongodb';

function getGeoNear(loc, filter) {
  return {
    spherical: true,
    near: loc,
    distanceField: 'distance',
    query: filter,
  };
}

export default {

  get: async function(req, res) {
    const { profile: { lookingFor, sexValue, loc, tags }, id } = req.user;
    const users = db.collection('Users');
    try {
      const filter = {
        _id: {$ne: ObjectId(id)},
        active: true,
      };
      if (lookingFor !== 3) filter.sexValue = lookingFor;
      filter.lookingFor = {$in: [sexValue, 3]};
      const $geoNear = getGeoNear(loc, filter);
      const $project = {
        login: 1,
        sexValue: 1,
        birthday: 1,
        profilePic: 1,
        distance: 1,
        communTags: {
          $size: {
            $filter: {
              input: '$tags',
              cond: {$in: ['$$this', tags]},
            },
          },
        },
        popularity: {
          $size: '$like.from'
        },
      };
      const matchs = await users.aggregate([{$geoNear}, {$project}]).toArray();
      // matchs.forEach(match => {
      //   if (ioServer.isLogged(match._id)) {
      //     match.logged = true;
      //   }
      // });
      res.send({matchs})
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

}

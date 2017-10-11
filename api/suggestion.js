import { ObjectId } from 'mongodb';

function getGeoNear(loc, id, sexValue, lookingFor, locFilter) {
  const query = {
    _id: {$ne: ObjectId(id)},
    active: true,
  }
  if (lookingFor !== 3) query.sexValue = lookingFor;
  query.lookingFor = {$in: [sexValue, 3]};
  let limit;
  switch (locFilter) {
    case '1':
      limit = 20 * 1000;
      break;

    case '2':
      limit = 50 * 1000;
      break;

    case '3':
      limit = 200 * 1000;
      break;

    default: limit = 400 * 1000;
  }
  return {
    spherical: true,
    near: loc,
    distanceField: 'distance',
    maxDistance: limit,
    query,
  };
}

function getAgeFilter(ageFilter) {
  const dateMin = new Date();
  const dateMax = new Date();
  switch (ageFilter) {
    case '1':
      dateMin.setFullYear(dateMin.getFullYear() - 18);
      dateMax.setFullYear(dateMax.getFullYear() - 26);
      break;

    case '2':
      dateMin.setFullYear(dateMin.getFullYear() - 26);
      dateMax.setFullYear(dateMax.getFullYear() - 36);
      break;

    case '3':
      dateMin.setFullYear(dateMin.getFullYear() - 36);
      dateMax.setFullYear(dateMax.getFullYear() - 51);
      break;

    case '4':
      dateMin.setFullYear(dateMin.getFullYear() - 51);
      dateMax.setFullYear(dateMax.getFullYear() - 71);
      break;

    case '5':
      dateMin.setFullYear(dateMin.getFullYear() - 71);
      dateMax.setFullYear(dateMax.getFullYear() - 101);
      break;

    default:
      dateMin.setFullYear(dateMin.getFullYear() - 18);
      dateMax.setFullYear(dateMax.getFullYear() - 101);
  }
  return {
    $lte: dateMin,
    $gt: dateMax,
  }
}

function getPopFilter(popFilter) {
  let min;
  switch (popFilter) {
    case '1':
      min = 1;
      break;

    case '2':
      min = 10;
      break;

    case '3':
      min = 100;
      break;

    case '4':
      min = 500;
      break;

    default: min = -500;
  }
  return {
    $gte: min,
  }
}

function getFilter(query) {
  let { ageFilter, popFilter, tagsFilter, sort, tag1, tag2, tag3 } = query;

  return {
    birthday: getAgeFilter(ageFilter),
    popularity: getPopFilter(popFilter),
  };
}

const distScoreObj = {
  $cond: {
    if: {$lte: ['$distance', 50 * 1000]},
    then: {
      $add: [
        200,
        {$divide: [{$subtract: [50 * 1000, '$distance']}, 1000]},
      ]
    },
    else: {
      $cond: {
        if: {$lte: ['$distance', 100 * 1000]},
        then: {
          $add: [
            100,
            {$divide: [{$subtract: [100 * 1000, '$distance']}, 1000]},
          ]
        },
        else: {
          $cond: {
            if: {$lte: ['$distance', 200 * 1000]},
            then: {
              $divide: [{$subtract: [200 * 1000, '$distance']}, 1000],
            },
            else: 0,
          }
        }
      }
    }
  }
};


const scoreObj = {
  $let: {
    vars: {
      dist: distScoreObj,
      tag: {$multiply: ['$communTags', 20]},
      pop: {$divide: ['$popularity', 1]},
    },
    in: {$add: ['$$dist', '$$tag', '$$pop']}
  }
};

export default {

  get: async function(req, res) {
    const {
      user: {
        profile: { lookingFor, sexValue, loc, tags },
        id,
      },
      query,
    } = req;
    let { page, nb, locFilter } = query;
    const users = db.collection('Users');
    try {
      const filter = getFilter(query);
      const geoNear = getGeoNear(loc, id, sexValue, lookingFor, locFilter);
      const initProject = {
        _id: 1,
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
          $subtract: [
            {$size: '$like.from'},
            {$size: '$block'},
          ],
        },
      };
      const project = {
        _id: 1,
        login: 1,
        sexValue: 1,
        birthday: 1,
        profilePic: 1,
        distance: 1,
        communTags: 1,
        popularity: 1,
        score: scoreObj,
      };
      const cursor = users.aggregate();
      cursor.geoNear(geoNear)
      .project(initProject)
      .project(project)
      .match(filter)
      .sort({score: -1})
      .skip((page - 1) * nb)
      .limit(+nb)

      // const matchs = await users.aggregate([
      //   {$geoNear: geoNear},
      //   {$project: initProject},
      //   {$project: project},
      //   {$match: filter},
      //   {$sort: {score: -1}},
      //   {$skip: (page - 1) * nb},
      //   {$limit: +nb},
      // ]).toArray();

      const matchs = await cursor.toArray();
      res.send({matchs})
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

}

import { ObjectId } from 'mongodb';

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

function getSpecialTagsFilter(tag1, tag2, tag3) {
  const targetArray = [];
  if (tag1) targetArray.push(tag1);
  if (tag2) targetArray.push(tag2);
  if (tag3) targetArray.push(tag3);

  return {
    $all: targetArray,
  };
}



export function getGeoNear(loc, id, query, sexValue, lookingFor, block) {
  const { locFilter, ageFilter, tag1, tag2, tag3, mode } = query;
  const ids = [ObjectId(id)];
  block.forEach(id => ids.push(ObjectId(id)));
  const filter = {
    _id: {$not: {$in: ids}},
    active: true,
    birthday: getAgeFilter(ageFilter),
    profilePic: {$exists: true}
  }
  let distanceLimit;

  if (mode === '1') { //suggestion mode
    if (lookingFor !== 3) filter.sexValue = lookingFor;
    filter.lookingFor = {$in: [sexValue, 3]};
    distanceLimit = 400; //default in suggestion mode
  }

  if (locFilter === '1') distanceLimit = 20;
  else if (locFilter === '2') distanceLimit = 50;
  else if (locFilter === '3') distanceLimit = 200;

  if (tag1 || tag2 || tag3) filter.tags = getSpecialTagsFilter(tag1, tag2, tag3);

  const geoNear = {
    spherical: true,
    near: loc,
    distanceField: 'distance',
    query: filter,
    limit: 2000,
  };

  if (distanceLimit) geoNear.maxDistance = distanceLimit * 1000;

  return geoNear;
}

function getPopFilter(popFilter) {
  let min = 0; //default

  if (popFilter === '1') min = 10;
  else if (popFilter === '2') min = 50;
  else if (popFilter === '3') min = 200;
  else if (popFilter === '4') min = 500;

  return {
    $gte: min,
  }
}

function getTagsFilter(tagsFilter) {
  let min = 0; //default

  if (tagsFilter === '1') min = 1;
  else if (tagsFilter === '2') min = 2;
  else if (tagsFilter === '3') min = 3;
  else if (tagsFilter === '4') min = 4;

  return {
    $gte: min,
  }
}

export function getFilter(popFilter, tagsFilter) {
  return {
    popularity: getPopFilter(popFilter),
    communTags: getTagsFilter(tagsFilter),
  };
}

export function initProject(tags) {
  return {
    _id: 1,
    login: 1,
    sexValue: 1,
    birthday: 1,
    profilePic: 1,
    distance: 1,
    tags: 1,
    communTags: {
      $size: {
        $filter: {
          input: '$tags',
          cond: {$in: ['$$this', tags]},
        },
      },
    },
    popularity: {
      $add: [
        {$multiply: [{$size: '$like.from'}, 10]},
        {$floor: {$divide: ['$nbVisit', 10]}}
      ]
    },
  };
}

const distScoreObj = {
  $cond: {
    if: {$lte: ['$distance', 50 * 1000]},
    then: {
      $add: [
        300,
        {$divide: [{$subtract: [50 * 1000, '$distance']}, 1000]},
      ]
    },
    else: {
      $cond: {
        if: {$lte: ['$distance', 100 * 1000]},
        then: {
          $add: [
            200,
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
      tag: {$multiply: ['$communTags', 50]},
      pop: {$divide: ['$popularity', 1]},
    },
    in: {$add: ['$$dist', '$$tag', '$$pop']}
  }
};

export const finalProject = {
  _id: 1,
  login: 1,
  sexValue: 1,
  tags: 1,
  birthday: 1,
  profilePic: 1,
  distance: 1,
  communTags: 1,
  popularity: 1,
  score: scoreObj,
};

export function getSortObj(sort) {

  if (sort === '1') return {distance: 1, score: -1};
  if (sort === '2') return {birthday: -1, score: -1};
  if (sort === '3') return {popularity: -1, score: -1};
  if (sort === '4') return {communTags: -1, score: -1};
  return {score: -1, distance: 1} // default
}

import * as tools from './aggregateTools';

export default {

  get: async function(req, res) {
    const {
      user: {
        profile: { lookingFor, sexValue, loc, tags, block },
        id,
      },
      query,
    } = req;

    let { page, nb, sort, popFilter, tagsFilter } = query;
    nb = parseInt(nb);
    if (isNaN(nb) || nb <= 0 || nb > 20) nb = 8;
    page = parseInt(page);
    if (isNaN(page) || page <= 0) page = 1;
    const users = db.collection('Users');
    try {
      const geoNear = tools.getGeoNear(loc, id, query, sexValue, lookingFor, block);
      const firstProject = tools.initProject(tags);
      const filter = tools.getFilter(popFilter, tagsFilter);
      const sortObj = tools.getSortObj(sort);

      const cursor = users.aggregate();

      cursor.geoNear(geoNear)

      .project(firstProject)
      .project(tools.finalProject)
      .match(filter)
      .sort(sortObj)
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
      res.send({matchs});
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

}

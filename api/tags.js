export default {

  get: async function(req, res) {
    try {
      const { tags } = await db.collection('Tags').findOne({});
      res.send(tags);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },

  patch: async function(req, res) {
    const { tag } = req.body;
    try {
      const { tags } = await db.collection('Tags').findOne({});
      if (tags.indexOf(tag) === -1 && tag.match(/^[a-zA-Z0-9-$']{3,12}$/)) {
        db.collection('Tags').updateOne({}, {$push: {tags: tag}});
      }
      res.end();
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },

}

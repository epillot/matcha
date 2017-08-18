
export default {

  get: async function(req, res) {
    const { params: { login }, user: { login: currentUser } } = req;
    try {
      const profile = await db.collection('Users').findOne({login}, {
        _id: 0,
        firstname: 1,
        lastname: 1,
        sex: 1,
        birthday: 1,
        lookingFor: 1,
        login: 1,
        email: 1,
        pictures: 1,
        profilePic: 1,
        tags: 1,
      });
      res.send(profile);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },

}

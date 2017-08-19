import sharp from 'sharp';
import fs from 'fs';

export default {

  check: async function(req, res, next) {
    try {
      const { login } = req.user;
      const { pictures: { length } } = await db.collection('Users').findOne({login});
      if (length >= 5) return res.send('Max upload');
      next();
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },

  post: async function(req, res) {
    const { user: { login }, file: { filename } } = req;
    sharp(`uploads/tmp/${filename}`)
    .resize(720, 540)
    .toFile(`uploads/${filename}`)
    .then(() => {
      fs.unlink(`uploads/tmp/${filename}`, err => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        try {
          db.collection('Users').updateOne({login}, {$push: {pictures: filename}});
          res.status(201).send(filename);
        } catch (e) {
          console.log(e);
          res.sendStatus(500);
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  },

  delete: function(req, res) {
    const { params: { pic }, user: { login } } = req;
    fs.unlink(`uploads/${pic}`, async err => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      try {
        const { pictures, profilePic } = await db.collection('Users').findOne({login});
        if (pictures.indexOf(pic) !== -1) {
          const update = {$pull: {pictures: pic}};
          if (pic === profilePic) update.$set = {profilePic: null};
          db.collection('Users').updateOne({login}, update);
          res.end();
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    });
  },

};

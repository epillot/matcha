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
        if (err) console.log(err);
        try {
          db.collection('Users').updateOne({login}, {$push: {pictures: filename}});
          res.status(201).send(filename);
        } catch (e) { console.log(e); res.sendStatus(500) }
      });
    }).catch(err => { console.log(err); res.sendStatus(500) });
  },

  delete: async function(req, res) {
    const { params: { pic }, user: { login } } = req;
    try {
      const { pictures, profilePic } = await db.collection('Users').findOne({login});
      if (pictures.indexOf(pic) === -1) {
        return res.status(401).send({error: 'Not allowed to delete this picture'});
      }
      fs.unlink(`uploads/${pic}`, err => {
        if (err) console.log(err);
      });
      const update = {$pull: {pictures: pic}};
      if (pic === profilePic) update.$set = {profilePic: null};
      db.collection('Users').updateOne({login}, update);
      res.sendStatus(202);
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

};

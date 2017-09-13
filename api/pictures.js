import sharp from 'sharp';
import fs from 'fs';
import { ObjectId } from 'mongodb';

export default {

  check: async function(req, res, next) {
    try {
      const _id = ObjectId(req.user.id);
      const { pictures: { length } } = await db.collection('Users').findOne({_id});
      if (length >= 5) return res.send('Max upload');
      next();
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },

  post: async function(req, res) {
    const { user: { id }, file: { filename } } = req;
    sharp(`uploads/tmp/${filename}`)
    .resize(720, 540)
    .toFile(`uploads/${filename}`)
    .then(() => {
      fs.unlink(`uploads/tmp/${filename}`, err => {
        if (err) console.log(err);
        try {
          const _id = ObjectId(id);
          db.collection('Users').updateOne({_id}, {$push: {pictures: filename}});
          res.status(201).send(filename);
        } catch (e) { console.log(e); res.sendStatus(500) }
      });
    }).catch(err => { console.log(err); res.sendStatus(500) });
  },

  delete: async function(req, res) {
    const { params: { pic }, user: { id } } = req;
    try {
      const _id = ObjectId(id);
      const { pictures, profilePic } = await db.collection('Users').findOne({_id});
      if (pictures.indexOf(pic) === -1) {
        return res.status(401).send({error: 'Not allowed to delete this picture'});
      }
      const update = {$pull: {pictures: pic}};
      if (pic === profilePic) update.$set = {profilePic: null};
      db.collection('Users').updateOne({_id}, update);
      res.sendStatus(202);
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

};

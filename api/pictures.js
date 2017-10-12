import sharp from 'sharp';
import fs from 'fs';
import { ObjectId } from 'mongodb';

export default {

  check: async function(req, res, next) {
    try {
      const _id = ObjectId(req.user.id);
      const { pictures: { length } } = await db.collection('Users').findOne({_id});
      if (length >= 5) return res.send({error: 'You can\'t upload more than 5 pictures.'});
      next();
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },

  // checkError(err) {
  //     console.log(err);
  //     return res.sendStatus(400);
  //   }
  //   next();
  // },

  post: async function(req, res) {
    if (!req.file) res.send({error: 'ulpoad failed'});
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
          res.status(201).send({filename});
        } catch (e) { console.log(e); res.sendStatus(500) }
      });
    }).catch(err => { res.send({error: 'Not a valid file'}) });
  },

  delete: async function(req, res) {
    const { params: { pic }, user: { id, profile } } = req;
    try {
      const _id = ObjectId(id);
      const { pictures, profilePic } = profile;
      if (pictures.indexOf(pic) === -1 || pic === profilePic) {
        return res.status(401).send({error: 'Not allowed to delete this picture'});
      }
      const update = {$pull: {pictures: pic}};
      db.collection('Users').updateOne({_id}, update);
      res.sendStatus(202);
    } catch (e) { console.log(e); res.sendStatus(500) }
  },

};

import sharp from 'sharp';
import fs from 'fs';

const check = async (req, res, next) => {
  const { login } = req.user;
  const { pictures: { length } } = await db.collection('Users').findOne({login});
  if (length >= 5) return res.send('Max upload');
  next();
}

const save = (req, res) => {
  const { user: { login }, file: { filename } } = req;
  db.collection('Users').updateOne({login}, {$push: {pictures: filename}});
  sharp(`uploads/tmp/${filename}`)
  .resize(720, 540)
  .toFile(`uploads/${filename}`)
  .then(() => {
    fs.unlink(`uploads/tmp/${filename}`, err => {
      if (err) console.log(err);
    });
  })
  .catch(err => console.log(err));
  res.send(filename);
}

const deletePic = async (req, res) => {
  const { params: { pic }, user: { login } } = req;
  const { pictures, profilePic } = await db.collection('Users').findOne({login});
  if (pictures.indexOf(pic) === -1) return res.end();
  const update = {$pull: {pictures: pic}};
  if (pic === profilePic) update.$set = {profilePic: null};
  db.collection('Users').updateOne({login}, update);
  fs.unlink(`uploads/${pic}`, err => {
    if (err) console.log(err);
  });
  res.end();
}

const setProfilePic = (req, res) => {
  const { params: { pic }, user: { login } } = req;
  db.collection('Users').updateOne({login}, {$set: {profilePic: pic}});
  res.end();
}

export default { check, save, deletePic, setProfilePic };

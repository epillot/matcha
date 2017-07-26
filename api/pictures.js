import sharp from 'sharp';
import fs from 'fs';

const upload = (req, res) => {
  const { user: { login }, file: { filename } } = req;
  db.collection('Users').updateOne({login}, {$push: {pictures: filename}});
  sharp(`uploads/tmp/${filename}`)
  .resize(720, 540)
  .toFile(`uploads/${filename}`)
  .then(() => {
    fs.unlink(`uploads/tmp/${filename}`, err => {
      if (err) console.log(err);
    })
  })
  .catch(err => console.log(err));
  res.send(filename);
}

export default { upload };

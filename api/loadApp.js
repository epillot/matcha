import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import expressJwt from 'express-jwt';
import profile from './profile';
import multer from 'multer';
import pictures from './pictures';
import tags from './tags';
import auth from './auth';
import { ObjectId } from 'mongodb';

const storage = multer.diskStorage({
  destination: 'uploads/tmp/',
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

export default function(app) {
  // app.use(express.static(path.resolve('../app/build'), {
  //   dotfiles: 'ignore',
  //   index: false,
  // }));


  app.use(morgan('dev'))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())

  .post('/api/signup', auth.signup)
  .post('/api/activation', auth.activation)
  .post('/api/signin', auth.signin)

  .use(expressJwt({secret: config.jwtSecret}))
  .use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.send('Unauthorized');
    }
  })
  .use(async (req, res, next) => {
    const _id = ObjectId(req.user.id);
    const user = await db.collection('Users').findOne({_id});
    if (!user) return res.send('Unauthorized');
    next();
  })

  .get('/api/auth', auth.get)
  .get('/api/profile/:id', profile.get)
  .patch('/api/profile/:id', profile.patch)
  .get('/api/alltags', tags.get)
  .patch('/api/allTags', tags.patch)
  .post('/api/pictures', pictures.check, multer({storage}).single('picture'), pictures.post)
  .delete('/api/pictures/:pic', pictures.delete)
  //.put('/api/pictures/:pic', pictures.setProfilePic);
  // app.get('*', function(req, res) {
  //   res.sendFile(path.resolve('../app/build/index.html'));
  // });
};

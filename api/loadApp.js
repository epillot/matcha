import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import expressJwt from 'express-jwt';
import account from './account';
import profile from './profile';
import multer from 'multer';
import pictures from './pictures';
import tags from './tags';
import auth from './auth';

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
  .post('/api/activation', account.activation)
  .post('/api/signin', account.signin)

  .use(expressJwt({secret: config.jwtSecret}))
  .use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.send('Unauthorized');
    }
  })
  .use((req, res, next) => {
    const { login } = req.user;
    const user = db.collection('Users').findOne({login});
    if (!user) res.send('Unauthorized');
    next();
  })
  .get('/api/auth', account.auth)
  .get('/api/profile/:login', profile.get)
  .patch('/api/profile/:login', profile.patch)
  .get('/api/alltags', tags.get)
  .patch('/api/allTags', tags.patch)
  .post('/api/pictures', pictures.check, multer({storage}).single('picture'), pictures.post)
  .delete('/api/pictures/:pic', pictures.delete)
  //.put('/api/pictures/:pic', pictures.setProfilePic);
  // app.get('*', function(req, res) {
  //   res.sendFile(path.resolve('../app/build/index.html'));
  // });
}

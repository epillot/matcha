import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import expressJwt from 'express-jwt';
import account from './account';
import multer from 'multer';
import pictures from './pictures';

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

  .post('/api/signup', account.signup)
  .post('/api/activation', account.activation)
  .post('/api/signin', account.signin)

  .use(expressJwt({ secret: config.jwtSecret}))
  .use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.send('Unauthorized');
    }
  })
  .get('/api/auth', account.auth)
  .get('/api/myprofile', account.myprofile)
  .post('/api/pictures/uploads', multer({storage}).single('picture'), pictures.upload);
  // app.get('*', function(req, res) {
  //   res.sendFile(path.resolve('../app/build/index.html'));
  // });
}

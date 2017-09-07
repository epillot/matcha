import morgan from 'morgan';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import profile from './profile';
import multer from 'multer';
import pictures from './pictures';
import tags from './tags';
import auth from './auth';
import suggestion from './suggestion';
import { ObjectId } from 'mongodb';
import ipInfo from 'ipinfo';

const storage = multer.diskStorage({
  destination: 'uploads/tmp/',
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

export default function(app) {

  app.use(morgan('dev'))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  // .use((req, res, next) => {
  //   var ip = req.headers['x-forwarded-for'] ||
  //    req.connection.remoteAddress ||
  //    req.socket.remoteAddress ||
  //    req.connection.socket.remoteAddress;
  //   console.log(ip);
  //   ipInfo(ip, (err, res) => {
  //     console.log(res || err);
  //     next()
  //   })
  // })

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
  .get('/api/suggestion', suggestion.get)
  //.put('/api/pictures/:pic', pictures.setProfilePic);
};

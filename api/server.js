import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import Database from './Database';

const app = express();
const port = 8000;
const mongoDb = new Database();

const checkSignupErrors = (req) => {
  let err = {};
  const fields = Object.keys(req);
  fields.forEach( (field) => {
    if (!req[field]) {
      Object.assign(err, {[field]: 'This field is required'})
    }
  });
  return err;
  // if (!req.firstname) {
  //   err.push({firstname: 'empty'});
  // }
}
// app.use(express.static(path.resolve('../app/build'), {
//   dotfiles: 'ignore',
//   index: false,
// }));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/signup', (req, res) => {
  const err = checkSignupErrors(req.body);
  if (Object.keys(err).length === 0) {
    mongoDb.users.insertOne(req.body);
  }
  res.send(err);
});

// app.get('/', function(req, res) {
//   res.sendFile(path.resolve('../app/build/index.html'));
// });

app.listen(port);

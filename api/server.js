import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import Database from './Database';
import parser from './parser'

const app = express();
const port = 8000;
const mongoDb = new Database();


// let test = function(callback) {
//   return new Database;
// }
//
//
//
// let a = test();
// a.then(console.log(a))
// app.use(express.static(path.resolve('../app/build'), {
//   dotfiles: 'ignore',
//   index: false,
// }));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/signup', (req, res) => {
  const err = parser.signup(req.body);
  console.log(err);
  if (Object.keys(err).length === 0) {
    const input = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      login: req.body.login,
      password: req.body.password,
      email: req.body.email
    }
    mongoDb.users.insertOne(input);
  }
  res.send(err);
});

// app.get('/', function(req, res) {
//   res.sendFile(path.resolve('../app/build/index.html'));
// });

app.listen(port);

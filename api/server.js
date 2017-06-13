import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = 8000;

// app.use(express.static(path.resolve('../app/build'), {
//   dotfiles: 'ignore',
//   index: false,
// }));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( (req, res, next) => {
  console.log('Je passe par la');
  next();
} );

app.post('/api/signup', (req, res) => {
  console.log(req.body);
  res.send('a');
})

// app.get('/', function(req, res) {
//   res.sendFile(path.resolve('../app/build/index.html'));
// });

app.listen(port);

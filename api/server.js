import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes';

const app = express();
const port = 8000;

// app.use(express.static(path.resolve('../app/build'), {
//   dotfiles: 'ignore',
//   index: false,
// }));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes(app);

// app.get('/', function(req, res) {
//   res.sendFile(path.resolve('../app/build/index.html'));
// });

app.listen(port);

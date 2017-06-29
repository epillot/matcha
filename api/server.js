import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes';
import Database from './Database';
import expressJwt from 'express-jwt';

//import session from 'cookie-session';

const app = express();
const port = 8000;
// app.use(express.static(path.resolve('../app/build'), {
//   dotfiles: 'ignore',
//   index: false,
// }));

//app.use(session({ secret: 'lalal' })),
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressJwt({ secret: 'JLsnn45HdSlmKsjkslskl'})
.unless({path: ['/api/signin', '/api/signup', '/api/activation']}));

routes(app);

// app.get('*', function(req, res) {
//   //req.session.count = req.session.count ? req.session.count + 1 : 1;
//   res.sendFile(path.resolve('../app/build/index.html'));
//   //console.log(req.session.count);
// });

app.listen(port);

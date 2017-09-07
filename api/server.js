import express from 'express';
import { MongoClient } from 'mongodb';
import config from './config/config';
import loadApp from './loadApp';
import path from 'path';
//import cors from 'cors'

global.config = config;
const port = process.env.PORT || 8000;
const app = express();
//app.use(cors());
app.use('/static', express.static('uploads'));
loadApp(app);

MongoClient.connect(config.mongoConfig).then(db => {

  console.log('Connected correctly to database');
  global.db = db;
  app.listen(port);
  console.log('server started on port ' + port);

  process.on('SIGINT', () => {
    db.close(() => {
      console.log('\nConnection to database closed');
      process.exit(0);
    });
  });

}).catch(e => console.log(e));

process.on('exit', () => console.log('See you soon ;)'));

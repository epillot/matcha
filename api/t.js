import { MongoClient } from 'mongodb';
import config from './config/config';


MongoClient.connect(config.mongoConfig).then(db => {
  global.db = db;
  // return db.collection('Users').find({}).toArray();
  return db.collection('Users').createIndex({loc: '2dsphere'})
}).then(res => {
  console.log('success ', res);
  db.close(() => { process.exit(0) })
}).catch(e => {
  console.log(e);
  db.close(() => { process.exit(1) });
});

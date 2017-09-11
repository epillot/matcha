import { MongoClient } from 'mongodb';
import config from './config/config';


MongoClient.connect(config.mongoConfig).then(db => {
  global.db = db;
  return db.collection('Users').update({}, {$set: {ts: Date.now()}}, {multi: true});
}).then(res => {
  console.log('success', res);
  db.close();
  process.exit(0);
}).catch(e => {
  db.close()
  console.log(e);
  process.exit(1);
});

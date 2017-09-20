import { MongoClient } from 'mongodb';
import config from './config/config';


MongoClient.connect(config.mongoConfig).then(db => {
  global.db = db;
  return db.collection('Users').update({}, {
    $set: {
      like: {
        to: [],
        from: [],
      }
    }
  }, {multi: true});
}).then(res => {
  console.log('success');
  db.close();
  process.exit(0);
}).catch(e => {
  db.close()
  console.log(e);
  process.exit(1);
});

// MongoClient.connect(config.mongoConfig).then(db => {
//   db.
// });

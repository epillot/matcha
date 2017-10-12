import { MongoClient, ObjectId} from 'mongodb';
import config from './config/config';

MongoClient.connect(config.mongoConfig).then(db => {
  global.db = db;
  const datelimit = new Date();

  return db.collection('Users').find({}).toArray();
}).then(res => {
  return Promise.all(res.map(r => {
    const rdm = Math.floor(Math.random() * 100) + 50;
    return db.collection('Users').updateOne({_id: r._id}, {$set: {nbVisit: rdm}});
  }));
}).then(() => {
  db.close(() => { process.exit(0) })
}).catch(e => {
  console.log(e);
  db.close(() => { process.exit(1) });
});

// const getRdmPw = function() {
//   const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const digits = '0123456789';
//   let pw = '';
//   for (let i = 0; i < 6; i++) {
//     pw += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   for (let i = 0; i < 3; i++) {
//     pw += digits.charAt(Math.floor(Math.random() * digits.length));
//   }
//   return pw;
// }
//
// for (let i = 0; i < 10; i++) { console.log(getRdmPw()) }

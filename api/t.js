import { MongoClient, ObjectId } from 'mongodb';
import config from './config/config';


MongoClient.connect(config.mongoConfig).then(db => {
  global.db = db;
  return db.collection('Users').find({_id: {$ne: ObjectId('598483259c23dc36620de2b1')}}, {_id: 1}).toArray();
}).then(res => {

  const ids = res.map(id => id._id.toString());


  return db.collection('Users').updateOne({_id: ObjectId('598483259c23dc36620de2b1')}, {
    $set: {
      bio: '',
    }
  });
}).then(res => {
  console.log('success ', res);
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

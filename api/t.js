import { MongoClient, ObjectId} from 'mongodb';
import config from './config/config';

// MongoClient.connect(config.mongoConfig).then(db => {
//   global.db = db;
//   const datelimit = new Date();
//   return db.collection('Users').find({tags: {$all : ['dragon', 'GOT', 'poney']}}).toArray();
// }).then(res => {
//   res.forEach(r => console.log(r.login))
// }).then(res => {
//   console.log('success ');
//   db.close(() => { process.exit(0) })
// }).catch(e => {
//   console.log(e);
//   db.close(() => { process.exit(1) });
// });

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

const a = 'lol'

const b = parseInt(a)


console.log(b <= 0);

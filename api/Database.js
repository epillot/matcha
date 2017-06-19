import config from './config/config';
import { MongoClient } from 'mongodb';

class Database {
  constructor() {
    MongoClient.connect(config.database)
    .then(db => {
      console.log('Connected correctly to database');
      this.db = db;
      this.users = db.collection('Users');
    })
    .catch(err => console.log(err));
  }
}

export default Database;

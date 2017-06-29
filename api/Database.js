import { mongoConfig } from './config/config';
import { MongoClient } from 'mongodb';

//const { mongoConfig } = config;

class Database {
  constructor() {
    MongoClient.connect(mongoConfig.database)
    .then(db => {
      console.log('Connected correctly to database');
      this.db = db;
      this.users = db.collection('Users');
    })
    .catch(err => console.log(err));
  }
}

export default new Database();

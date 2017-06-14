import config from './config/config';
import { MongoClient } from 'mongodb';
import assert from 'assert';

class Database {
  constructor() {
    MongoClient.connect(config.database, (err, db) => {
      assert.equal(err, null);
      this.db = db;
      this.users = db.collection('Users');
      console.log("Connected correctly to database");
    });
  }
}

export default Database;

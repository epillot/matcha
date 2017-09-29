import http from 'http';
import express from 'express';
import { MongoClient } from 'mongodb';
import config from './config/config';
import loadApp from './loadApp';
import path from 'path';
import createSocketServer, { initSocket } from './sockets'
//import cors from 'cors'


global.config = config;
const port = process.env.PORT || 8000;
const app = express();
const server = http.Server(app);
global.ioServer = createSocketServer(server);
app.use('/static', express.static('uploads'));
loadApp(app);

ioServer.on('connection', socket => {
  initSocket(socket, ioServer);
});

MongoClient.connect(config.mongoConfig).then(db => {

  console.log('Connected correctly to database');
  global.db = db;
  server.listen(port);
  console.log('server started on port ' + port);

  process.on('SIGINT', async () => {
    await db.close();
    console.log('\nConnection to database closed');
    await ioServer.close();
    console.log('\nConnection to sockets closed');
    process.exit(0);
  });

}).catch(e => console.log(e));

process.on('exit', () => console.log('See you soon ;)'));

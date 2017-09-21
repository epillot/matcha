import http from 'http';
import express from 'express';
import { MongoClient } from 'mongodb';
import config from './config/config';
import loadApp from './loadApp';
import path from 'path';
import sockets from './sockets'
//import cors from 'cors'


global.config = config;
const port = process.env.PORT || 8000;
const app = express();
const server = http.Server(app);
global.ioServer = sockets(server);
//app.use(cors());
app.use('/static', express.static('uploads'));
loadApp(app);

ioServer.on('connection', socket => {

  socket.on('disconnect', () => {
    ioServer.disconnect(socket);
  });

  socket.on('logout', () => {
    ioServer.disconnect(socket);
  });

  socket.on('request', ({ id }) => {
    ioServer.connect(id, socket);
  });

  socket.on('visit', ({ id }) => {
    ioServer.handleVisit(id, socket);
  });

  socket.on('leavelog', ({ id }) => {
    socket.leave('log' + id);
  });

  socket.on('notif', ({ id }) => {
    ioServer.sendNotif(id, socket);
  });

  socket.on('join chat', ({ ids }) => {
    ids.forEach(id => socket.join('log' + id));
  });

})

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

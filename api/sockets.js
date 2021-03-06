import io from 'socket.io';
import { ObjectId } from 'mongodb';

class sockets extends io {

  constructor(server) {
    super(server);
    this.users = [];
  }

  getUserById(userId) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === userId) return this.users[i];
    }
    return null;
  }

  getUserBySocketId(socketId) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].socketId === socketId) return this.users[i];
    }
    return null;
  }

  isLogged(userId, socketId) {
    if (userId) return this.getUserById(userId) !== null;
    return this.getUserBySocketId(socketId) !== null;
  }

  add(userId, socketId) {
    this.users.push({
      id: userId,
      socketId,
    });
  }

  del(socketId) {
    let i;
    for (i = 0; i < this.users.length; i++) {
      if (this.users[i].socketId === socketId) break;
    }
    if (i >= this.users.length) return false;
    this.users.splice(i, 1);
  }

  disconnect(socket) {
    const user = this.getUserBySocketId(socket.id);
    if (user) {
      const _id = ObjectId(user.id);
      const ts = Date.now();
      this.del(socket.id);
      db.collection('Users').updateOne({_id}, {$set: {ts}});
      socket.to('log' + user.id).emit('changelog', {id: user.id, status: false, ts});
    }
  }

  connect(id, socket) {
    if (!this.isLogged(id)) {
      this.add(id, socket.id);
      socket.to('log' + id).emit('changelog', {id, status: true});
    }
  }

  async sendNotif(targetId) {
    const target = this.getUserById(targetId);
    if (target) {
      this.to(target.socketId).emit('notif');
    }
  }

  sendMessage(msg) {
    const target = this.getUserById(msg.idTarget);
    if (target) {
      this.to(target.socketId).emit('message', {msg});
    }
  }

}

export default function(server) {
  return new sockets(server);
}

export function initSocket(socket, ioServer) {
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
    socket.join('log' + id);
  });

  socket.on('leavelog', ({ id }) => {
    socket.leave('log' + id);
  });

  socket.on('join chat', ({ ids }) => {
    ids.forEach(id => socket.join('log' + id));
  });
}

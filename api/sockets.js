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

  handleVisit(targetId, socket) {
    socket.join('log' + targetId);
    this.sendNotif(targetId, socket);
  }

  async sendNotif(targetId, socket) {
    const { id: senderId } = this.getUserBySocketId(socket.id);
    const profile = await db.collection('Users').findOne({_id: ObjectId(targetId)});
    if (!profile || profile.block.indexOf(senderId) !== -1) return;
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

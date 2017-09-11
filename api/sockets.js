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
      socket.leave('users', () => {
        socket.to('users').emit('changelog', {id: user.id, status: false, ts});
      })
      console.log('users after disconnect', this.users);
    }
  }

  connect(id, socket) {
    if (!this.isLogged(id)) {
      this.add(id, socket.id);
      socket.join('users', () => {
        socket.to('users').emit('changelog', {id, status: true});
      });
    }
  }

  async handleVisit(from, to) {
    try {
      var idFrom = ObjectId(from);
      var idTo = ObjectId(to);
    } catch (e) { return }
    try {
      const ts = Date.now();
      const users = db.collection('Users')
      const pFrom = await users.findOne({_id: idFrom});
      if (!pFrom) return;
      const pTo = await users.findOne({_id: idTo});
      if (!pTo) return;
      const notif = {
        from,
        object: 'visit',
        ts,
      }
      users.updateOne({_id: idTo}, {$push: {notif}});
      const target = this.getUserById(to);
      if (target) {
        this.to(target.socketId).emit('notif', notif);
      }

    } catch (e) { console.log(e) }
  }

}

export default function(server) {
  return new sockets(server);
}

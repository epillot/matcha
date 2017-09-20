import axios from 'axios';

export default function(config, cb) {

  const token = localStorage.c_user;
  config.headers = Object.assign(config.headers || {}, {Authorization: `Bearer ${token}`});
  if (cb) {
    if (!token) return cb('Unauthorized');
    axios(config).then(response => {
      if (response.data === 'Unauthorized') cb('Unauthorized');
      else {
        const id = response.headers['x-requested-by'];
        global.socket.emit('request', {id});
        cb(null, response);
      }
    }).catch(err => console.log(err));
  } else {
    return new Promise((resolve, reject) => {
      if (!token) reject('Unauthorized');
      axios(config).then(response => {
        if (response.data === 'Unauthorized') reject('Unauthorized');
        else {
          const id = response.headers['x-requested-by'];
          global.socket.emit('request', {id});
          resolve(response);
        }
      }).catch(err => reject(err));
    });
  }
}

// export default function(config) {
//   return new Promise((resolve, reject) => {
//     const token = localStorage.c_user;
//     if (!token) reject('Unauthorized');
//     config.headers = Object.assign(config.headers || {}, {Authorization: `Bearer ${token}`});
//     axios(config).then(response => {
//       if (response.data === 'Unauthorized') reject('Unauthorized');
//       resolve(response);
//     }).catch(err => reject(err));
//   });
// }

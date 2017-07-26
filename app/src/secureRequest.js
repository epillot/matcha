import axios from 'axios';

export default function(config, cb) {
  const token = localStorage.c_user;
  if (!token) return cb('Unauthorized');
  config.headers = Object.assign(config.headers || {}, {Authorization: `Bearer ${token}`});
  axios(config).then(response => {
    if (response.data === 'Unauthorized') cb('Unauthorized');
    else cb(null, response);
  }).catch(err => cb(err));
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

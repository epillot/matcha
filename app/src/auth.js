import axios from 'axios';

class auth {
  constructor() {
    this.isAuth = false;
  }

  secureRequest(method, url, data, cb) {
    const token = localStorage.c_user;
    if (token === undefined) {
      return cb('No token stored');
    }
    const config = {
      method: method,
      url: url
    };
    if (data) config.data = data;
    config.headers = {Authorization: `Bearer ${token}`};
    console.log(config);
    axios(config)
    .then(response => cb(null, response))
    .catch(() => cb('Invalid or expired token'));
  }

  // authenticate() {
  //   // const token = localStorage.c_user;
  //   // if (token === undefined) {
  //   //   this.isAuth = false;
  //   //   if (cb) cb(false);
  //   // }
  //   // else {
  //   //   axios.get('/api/auth', {headers: {Authorization: `Bearer ${localStorage.getItem('c_user')}`}})
  //   //   .then( ({ status }) => {
  //   //     if (status === 200) this.isAuth = true;
  //   //     else this.isAuth = false;
  //   //     if (cb) cb(this.isAuth);
  //   //   });
  //   // }
  //   this.secureRequest('get', '/api/auth', null, (err, response) => {
  //     if (err) this.isAuth = false;
  //     else this.isAuth = true
  //   })
  // }

  // verifyAuth() {
  //   const token = localStorage.c_user;
  //   try {
  //     const decoded = jwtDecode(token);
  //     if (decoded && decoded.exp > Date.now() / 1000) {this.isAuth = true}
  //     else {this.isAuth = false}
  //   }
  //   catch (e) {this.isAuth = false}
  //   return (this.isAuth);
  // }
}

export default new auth();

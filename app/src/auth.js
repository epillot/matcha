import axios from 'axios';

class auth {
  constructor() {
    this.isAuth = false,
  }

  authenticate(cb) {
    const token = localStorage.c_user;
    if (token === undefined) {
      this.isAuth = false;
      if (cb) {cb(false)}
    }
    else {
      axios.post('/api/auth', {token: token})
      .then( ({ data }) => {
        this.isAuth = data.auth;
        if (cb) {cb(this.isAuth)}
      });
    }
  }

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

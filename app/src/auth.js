import axios from 'axios';

const auth = {
  secureRequest(config, cb) {
    const token = localStorage.c_user;
    if (token === undefined) {
      return cb('Unauthorized');
    }

    config.headers = Object.assign(config.headers || {}, {Authorization: `Bearer ${token}`});
    console.log(config);
    axios(config).then(response => {
      if (response.data === 'Unauthorized') cb('Unauthorized');
      else cb(null, response);
    }).catch(err => console.log(err));
  }
}

export default auth;

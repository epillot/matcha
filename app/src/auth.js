import axios from 'axios';

const auth = {
  secureRequest(method, url, data, cb) {
    const token = localStorage.c_user;
    if (token === undefined) {
      return cb('Unauthorized');
    }
    const config = {
      method: method,
      url: url
    };
    if (data) config.data = data;
    config.headers = {Authorization: `Bearer ${token}`};
    //console.log(config);
    axios(config).then(response => {
      if (response.data === 'Unauthorized') cb('Unauthorized');
      else cb(null, response);
    }).catch(err => console.log(err));
  }
}

export default auth;
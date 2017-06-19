import parser from './parser';
import Database from './Database';

const mongoDb = new Database();

const getSignupErrors = async (input) => {
  const err = parser.signup(input);

  if (err.login === undefined && await mongoDb.users.findOne({login: input.login}) !== null) {
      Object.assign(err, {login: 'This login is not availaible, please choose an other'});
  }

  if (err.email === undefined && await mongoDb.users.findOne({email: input.email}) !== null) {
      Object.assign(err, {email: 'This email was already used for signup, please use an other'});
  }
  return err;
}

const signup = (req, res) => {
  getSignupErrors(req.body).then(err => {
    if (Object.keys(err).length === 0) {
      const input = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
      };
      mongoDb.users.insertOne(input);
    }
    res.send(err);
  }).catch(e => console.log(e));
}

export default { signup }

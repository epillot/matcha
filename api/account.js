import parser from './parser';
import Database from './Database';
import bcrypt from 'bcrypt';

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

const getSigninErrors = async (input) => {
  const err = parser.signin(input);

  if (err.login === undefined) {
    const user = await mongoDb.users.findOne({login: input.login});
    if (!user) {
      err.login = 'There is no user with this login';
    }
    else if (err.password === undefined) {
      const auth = await bcrypt.compare(input.password, user.password);
      if (!auth) {
        err.password = 'Invalid password';
      }
    }
  }
  return err;

}

const signup = async (req, res) => {
  try {
    const err = await getSignupErrors(req.body);
    if (Object.keys(err).length === 0) {
      const hash = await bcrypt.hash(req.body.password, 10);
      const input = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        login: req.body.login,
        password: hash,
        email: req.body.email
      };
      mongoDb.users.insertOne(input);
    }
    res.send(err);
  } catch (e) { console.log(e) }
}

const signin = async (req, res) => {
  try {
    const err = await getSigninErrors(req.body);
    res.send(err);
  } catch (e) { console.log(e) }
}

export default { signup, signin }

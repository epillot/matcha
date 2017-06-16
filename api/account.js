import parser from './parser';
import Database from './Database';

//const mongoDb = new Promise(resolve => resolve( new Database() ));
const mongoDb = new Database();
//mongoDb.then(v => console.log(v.users));
//console.log(mongoDb);



const signup = async (req, res) => {
  const err = parser.signup(req.body);

  if (err.login === undefined) {
    const userExists = await mongoDb.users.findOne({login: req.body.login});

    if (userExists !== null) {
      Object.assign(err, {login: 'This login is not availaible, please choose an other'});
      console.log('Normalement en preums', err);
    }
  }

  if (err.email === undefined) {
    const emailExists = await mongoDb.users.findOne({email: req.body.email});

    if (emailExists !== null) {
      Object.assign(err, {email: 'This email was already used for signup, please use an other'});
      console.log('normalement en deuz', err);
    }
  }


  // .catch(err => console.log(err))
  // .then(() => {
  //   mongoDb.users.findOne({email: req.body.email});
  //   .then(email => {
  //     if (email && err.email === undefined) {
  //       Object.assign(err, {email: 'This email was already used for signup, please use an other'});
  //       console.log('normalement en deuz', err);
  //     }
  //   });
  // })
  // .catch(err => console.log(err))
  // .then(() => {
    console.log('Normalement en troiz', err);
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
}

export default { signup }

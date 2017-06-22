import { jwtSecret } from './config/config';
import jwt from 'jsonwebtoken';

// let token = jwt.sign({ foo: 'bar' }, jwtSecret, { expiresIn: 1 });
//
// console.log(token);

jwt.verify('', jwtSecret, (err, decoded) => {
  if (err) console.log('il ya eu une erreur', err);
  else console.log(decoded)
});

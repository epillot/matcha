import { jwtSecret } from './config/config';
import jwt from 'jsonwebtoken';

let token = jwt.sign({ foo: 'bar' }, jwtSecret, { expiresIn: 2 });
//
// console.log(token);
let decoded = jwt.decode(token);
console.log(decoded);
setTimeout(() => console.log(decoded.exp > Date.now() / 1000), 2000);
// jwt.verify('', jwtSecret, (err, decoded) => {
//   if (err) console.log('il ya eu une erreur', err);
//   else console.log(decoded)
// });
//
// let { a, b, ...rest } = {a:1, b:2, c:3, d:4};
// let f = {...rest};
// console.log(f);

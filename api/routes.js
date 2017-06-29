import account from './account';

const routes = (app) => {
  app.post('/api/signup', account.signup)
  .post('/api/signin', account.signin)
  .post('/api/activation', account.activation)
  .get('/api/auth', account.auth);
};

export default routes;

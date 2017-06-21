import account from './account';

const routes = (app) => {
  app.post('/api/signup', account.signup)
  .post('/api/signin', account.signin)
  .post('/api/activation', account.activation);
};

export default routes;

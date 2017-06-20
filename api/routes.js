import account from './account';

const routes = (app) => {
  app.post('/api/signup', account.signup);
  app.post('/api/signin', account.signin)
};

export default routes;

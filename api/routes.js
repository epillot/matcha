import account from './account';

const routes = (app) => {
  app.post('/api/signup', account.signup);
};

export default routes;

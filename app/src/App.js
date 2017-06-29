import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import Header from './Header';
import ActivationForm from './ActivationForm';
import PrivateRoute from './privateRoute';
//import auth from './auth';

const myprivate = () => <h1>Protected</h1>;

class App extends Component {

  state = {
    loggued: false,
  }

  render() {
    return (
      <div>
        <Header/>
        <Switch>
          <PrivateRoute exact path='/' component={myprivate}/>
          <Route path='/signin' component={SigninForm}/>
          <Route path='/signup' component={SignupForm}/>
          <Route path='/activation' component={ActivationForm}/>
        </Switch>
      </div>
    );
  }
}

export default App;

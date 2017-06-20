import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import Header from './Header';

class App extends Component {
  render() {
    return (
      <div>
        <Route path='/' component={Header}/>
        <Switch>
          <Route exact path='/' component={SigninForm}/>
          <Route exact path='/signin' component={SigninForm}/>
          <Route path='/signup' component={SignupForm}/>
        </Switch>
      </div>
    );
  }
}

export default App;

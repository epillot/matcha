import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={SignupForm}/>
        <Route path='/signin' component={SigninForm}/>
      </Switch>
    );
  }
}

export default App;

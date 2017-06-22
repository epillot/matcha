import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import Header from './Header';
import ActivationForm from './ActivationForm';
import axios from 'axios';

class App extends Component {


  // isLoggued =  async () => {
  //   const token = localStorage.c_user;
  //   if (token === undefined) {
  //     return { auth: false };
  //   }
  //   return axios.post('/api/auth', {token: token});
  // }

  render() {
  //  this.isLoggued().then((res) => console.log(res.data));
    return (
      <div>
        <Header history={this.props.history}/>
        <Switch>
          <Route exact path='/' component={SigninForm}/>
          <Route exact path='/signin' component={SigninForm}/>
          <Route path='/signup' component={SignupForm}/>
          <Route path='/activation' component={ActivationForm}/>
        </Switch>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import Header from './Header';
import ActivationForm from './ActivationForm';
import PrivateRoute from './privateRoute';
import UnlogguedRoute from './UnlogguedRoute';
import auth from './auth';

const myprivate = () => <h1>Protected</h1>;

class App extends Component {

  state = {
    loggued: null,
  }

  componentWillMount() {
    auth.secureRequest('get', '/api/auth', null, err => {
      this.setState({
        loggued: err ? false : true
      });
    });
  }

  onLog = () => {
    this.setState({
      loggued: true
    })
  }

  render() {
    console.log('App is rendering...');
    const { loggued } = this.state;
    return (
      <div>
        <Header loggued={loggued}/>
        <Switch>
          <PrivateRoute exact path='/' loggued={loggued} component={myprivate}/>
          <UnlogguedRoute path='/signin' onLog={this.onLog} loggued={loggued} component={SigninForm}/>
          <UnlogguedRoute path='/signup' loggued={loggued} component={SignupForm}/>
          <UnlogguedRoute path='/activation' loggued={loggued} component={ActivationForm}/>
        </Switch>
      </div>
    );
  }
}

export default App;

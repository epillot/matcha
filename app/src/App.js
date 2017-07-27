import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import Header from './Header';
import ActivationForm from './ActivationForm';
import PrivateRoute from './privateRoute';
import UnlogguedRoute from './UnlogguedRoute';
import secureRequest from './secureRequest';
import MyProfile from './MyProfile';

class App extends Component {

  constructor() {
    console.log('in app constructor');
    super();
    this.state = {
      loggued: false
    };
    this.onLog = this.onLog.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    const config = {
      method: 'get',
      url: '/api/auth'
    };
    secureRequest(config, err => {
      this.setState({
        loggued: err ? false : true
      });
    });
  }

  onLog() {
    this.setState({
      loggued: true
    });
  }

  onLogout() {
    this.setState({
      loggued: false
    });
  }

  render() {
    //console.log('App is rendering...');
    const { loggued } = this.state;
    return (
      <div>
        <Header loggued={loggued} onLogout={this.onLogout}/>
        <Switch>
          <PrivateRoute exact path='/' loggued={loggued} onLogout={this.onLogout} component={MyProfile}/>
          <UnlogguedRoute path='/signin' onLog={this.onLog} loggued={loggued} component={SigninForm}/>
          <UnlogguedRoute path='/signup' loggued={loggued} component={SignupForm}/>
          <UnlogguedRoute path='/activation' loggued={loggued} component={ActivationForm}/>
        </Switch>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import Home from './Home';
import Header from './Header';
import ActivationForm from './ActivationForm';
import PrivateRoute from './privateRoute';
import UnlogguedRoute from './UnlogguedRoute';
import secureRequest from './secureRequest';
import MyProfile from './MyProfile';

class App extends Component {

  constructor() {
    super();
    this.state = {
      loggued: !!localStorage.getItem('c_user'),
    };
    this.onLog = this.onLog.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentWillMount() {
    const config = {
      method: 'get',
      url: '/api/auth'
    };
    secureRequest(config, (err, response) => {
      this.setState({
        loggued: err ? false : response.data
      });
    });
  }

  onLog(user) {
    console.log(user);
    this.setState({loggued: user});
  }

  onLogout() {
    this.setState({loggued: false});
  }

  render() {
    const { loggued } = this.state;
    return (
      <div>
        <Header loggued={loggued} onLogout={this.onLogout} onLog={this.onLog}/>
        <Switch>
          <PrivateRoute path='/profile/:user' loggued={loggued} onLogout={this.onLogout} component={MyProfile}/>
          <UnlogguedRoute path='/home' loggued={loggued} component={Home}/>
          <UnlogguedRoute path='/activation' loggued={loggued} component={ActivationForm}/>
        </Switch>
      </div>
    );
  }
}

export default App;

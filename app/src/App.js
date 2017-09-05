import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import Home from './Home';
import Header from './Header';
import ActivationForm from './ActivationForm';
import PrivateRoute from './privateRoute';
import UnlogguedRoute from './UnlogguedRoute';
import secureRequest from './secureRequest';
import MyProfile from './MyProfile';

const salut = () => <div>salut</div>;

class App extends Component {

  constructor() {
    super();
    this.state = {
      loggued: null,
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
    this.setState({loggued: user});
  }

  onLogout() {
    this.setState({loggued: false});
  }

  render() {
    const { loggued } = this.state;
    return (
      <div>
        <Header
          loggued={loggued}
          onLogout={this.onLogout}
          onLog={this.onLog}
        />
        <Switch>
          <PrivateRoute exact path='/' loggued={loggued} onLogout={this.onLogout} component={salut}/>
          <PrivateRoute path='/profile/:user' loggued={loggued} onLogout={this.onLogout} component={MyProfile}/>
          <UnlogguedRoute path='/home' loggued={loggued} component={Home}/>
          <UnlogguedRoute path='/activation' loggued={loggued} component={ActivationForm}/>
        </Switch>
      </div>
    );
  }
}

export default App;

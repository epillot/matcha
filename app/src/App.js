import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import Home from './Home';
import Header from './Header2';
import ActivationForm from './ActivationForm';
import PrivateRoute from './privateRoute';
import UnlogguedRoute from './UnlogguedRoute';
import secureRequest from './secureRequest';
import MyProfile from './MyProfile';
import Suggestion from './Suggestion';
import Chat from './Chat';

const styles = {
  container: {
    marginTop: '70px',
  }
}

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
      let loggued = false;
      if (!err) {
        loggued = response.data;
        //global.socket.emit('logged');
      }
      this.setState({loggued});
    });
  }

  onLog(user) {
    this.setState({loggued: user});
  }

  onLogout() {
    global.socket.emit('logout');
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
        <div style={styles.container}>
        <Switch>
          <PrivateRoute exact path='/' loggued={loggued} onLogout={this.onLogout} component={Suggestion}/>
          <PrivateRoute path='/profile/:id' loggued={loggued} onLogout={this.onLogout} component={MyProfile}/>
          <PrivateRoute path='/message' loggued={loggued} onLogout={this.onLogout} component={Chat}/>
          <UnlogguedRoute path='/home' loggued={loggued} component={Home}/>
          <UnlogguedRoute path='/activation' loggued={loggued} component={ActivationForm}/>
        </Switch>
        </div>
      </div>
    );
  }
}

export default App;

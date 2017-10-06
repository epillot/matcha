import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import Home from './Home/';
import Header from './Header/';
import Activation from './Activation/';
import PrivateRoute from './PrivateRoute/';
import PublicRoute from './PublicRoute/';
import secureRequest from './secureRequest';
import Profile from './Profile/';
import Suggestion from './Suggestion/';
import Chat from './Chat/';
import Snackbar from 'material-ui/Snackbar';

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
      newMsg: false,
      open: false,
    };
    this.onLog = this.onLog.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.checkNewMsg = this.checkNewMsg.bind(this);
  }

  componentWillMount() {
    let config = {
      method: 'get',
      url: '/api/auth'
    };
    secureRequest(config, (err, response) => {
      let loggued = false;
      if (!err) loggued = response.data;
      this.setState({loggued});
      if (loggued) this.checkNewMsg();
    });
  }

  checkNewMsg() {
    const config = {
      method: 'get',
      url: '/api/chat/asNewMsg',
    }
    secureRequest(config, (err, response) => {
      if (err) return this.onLogout();
      const { newMsg } = response.data;
      this.setState({newMsg});
    });
  }

  onLog(user) {
    this.setState({loggued: user});
    this.checkNewMsg();
  }

  onLogout() {
    global.socket.emit('logout');
    this.setState({loggued: false});
  }

  render() {
    const { loggued, newMsg } = this.state;
    return (
      <div>
        <Header
          loggued={loggued}
          onLogout={this.onLogout}
          onLog={this.onLog}
          newMsg={newMsg}
          onNewMsg={() => this.setState({newMsg: true})}
          onResetPw={() => this.setState({open: true})}
        />
        <div style={styles.container}>
        <Switch>
          <PrivateRoute exact path='/' loggued={loggued} onLogout={this.onLogout} component={Suggestion}/>
          <PrivateRoute path='/profile/:id' loggued={loggued} onLogout={this.onLogout} component={Profile}/>
          <PrivateRoute path='/message' onRead={() => this.setState({newMsg: false})} loggued={loggued} onLogout={this.onLogout} component={Chat}/>
          <PublicRoute path='/home' loggued={loggued} component={Home}/>
          <PublicRoute path='/activation' loggued={loggued} component={Activation}/>
        </Switch>
        </div>
        <Snackbar
          open={this.state.open}
          message='Your password has been successfully reinitialized. Check your mails.'
          autoHideDuration={8000}
          onRequestClose={() => this.setState({open: false})}
        />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
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
  },
  fullContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '75vh',
  },
  footer: {
    position: 'relative',
    width: '95%',
    height: '30px',
    margin: '40px auto 20px auto'
  },
}

const notFound = () => <div style={styles.fullContainer}><p>Page not found</p></div>

class App extends Component {

  constructor() {
    super();
    this.state = {
      loggued: null,
      newMsg: false,
      open: false,
      message: '',
    };
    this.onLog = this.onLog.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.checkNewMsg = this.checkNewMsg.bind(this);
    this.displaySnackBar = this.displaySnackBar.bind(this);
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

  displaySnackBar(message) {
    this.setState({open: true, message})
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
          onResetPw={this.displaySnackBar}
        />
        <div style={styles.container}>
          <Switch>
            <PrivateRoute
              exact path='/'
              loggued={loggued}
              onAuthFailed={this.onLogout}
              component={Suggestion}
            />
            <PrivateRoute
              path='/profile/:id'
              loggued={loggued}
              onLogout={this.onLogout}
              component={Profile}
              onUpdatePw={this.displaySnackBar}
            />
            <PrivateRoute
              path='/message'
              onRead={() => this.setState({newMsg: false})}
              loggued={loggued}
              onAuthFailed={this.onLogout}
              component={Chat}
            />
            <PublicRoute
              path='/home'
              loggued={loggued}
              component={Home}
              onSignup={this.displaySnackBar}
            />
            <PublicRoute
              path='/activation'
              loggued={loggued}
              component={Activation}
              onActivation={this.displaySnackBar}
            />
            <Route path='*' component={notFound}/>
          </Switch>
        </div>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={8000}
          onRequestClose={() => this.setState({open: false})}
        />
        <div style={styles.footer}>
          <hr/>
          <div style={{position: 'absolute', right: '0'}}>
            <a href='https://github.com/epillot/matcha' target='_blank' rel='noopener noreferrer'>
              <img style={{width: '22px', height: '22px'}} src='/static/github' alt='github'/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

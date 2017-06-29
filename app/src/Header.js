import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
//import auth from './auth';

class Header extends Component {

  state = {
    //isLoggued: auth.isAuth,
    label: this.props.loggued === true ? 'logout' : (this.props.history.location.pathname !== '/signup' ? 'signup' : 'signin')
    //label: this.props.history.location.pathname !== '/signup' ? 'signup' : 'signin'
  }

  handleRightTouchTap = (e) => {
    if (this.state.label === 'logout') {
      localStorage.clear();
      this.props.onlogout();
    } else {
      this.props.history.push('/' + this.state.label);
      this.setState( prevState => {
        return {
          label: prevState.label === 'signup' ? 'signin' : 'signup'
        };
      });
    }
  }

  render() {
    console.log('Header is rendering...');
    console.log(this.props.loggued);
    console.log(this.state.label);
    return (
      <AppBar
        title="Matcha"
        iconElementRight={<FlatButton label={this.state.label}/>}
        onRightIconButtonTouchTap={this.handleRightTouchTap}
      />
    );
  }
}

export default withRouter(Header);

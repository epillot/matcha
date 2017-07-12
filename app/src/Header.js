import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
//import auth from './auth';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      label: this.props.history.location.pathname !== '/signup' ? 'signup' : 'signin'
    };
    this.handleRightTouchTap = this.handleRightTouchTap.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //console.log('la');
    if (nextProps.loggued === true) this.setState({label: 'logout'});
    else {
      this.setState({
        label: this.props.history.location.pathname !== '/signup' ? 'signup' : 'signin'
      });
    }
  }

  handleRightTouchTap() {
    //console.log('ici');
    if (this.state.label === 'logout') {
      localStorage.removeItem('c_user');
      this.props.onLogout();
    } else this.props.history.push('/' + this.state.label);
  }

  render() {
    //console.log('Header is rendering...');
    //console.log(this.props.loggued);
    //console.log(this.state.label);
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

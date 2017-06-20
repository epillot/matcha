import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

class Header extends Component {

  state = {
    label: this.props.history.location.pathname !== '/signup' ? 'signup' : 'signin'
  }

  handleRightTouchTap = (e) => {
    this.props.history.push('/' + this.state.label);
    this.setState( prevState => {
      return {
        label: prevState.label === 'signup' ? 'signin' : 'signup'
      };
    });
  }

  render() {
    return (
      <AppBar
        title="Matcha"
        iconElementRight={<FlatButton label={this.state.label}/>}
        onRightIconButtonTouchTap={this.handleRightTouchTap}
      />
    );
  }
}

export default Header;

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Signin from './Signin';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      label: 'signin',
      open: false,
      loading: false,
    };
    this.handleRightTouchTap = this.handleRightTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.onLog = this.onLog.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggued === true) this.setState({label: 'logout'});
    else this.setState({label: 'signin'});
  }

  handleRightTouchTap(e) {
    e.preventDefault();
    if (this.state.label === 'logout') {
      localStorage.removeItem('c_user');
      this.props.onLogout();
    } else {
      this.setState({
        open: true,
        anchorEl: e.currentTarget,
      });
    }
  }

  setLoading(loading) {
    this.setState({loading})
  }

  handleRequestClose() {
    if (!this.state.loading) this.setState({open: false});
  }

  onLog() {
    this.handleRequestClose();
    this.props.onLog();
  }

  render() {
    // console.log(this.props.location);
    // const { pathname, search } = this.props.location;
    // let fromActivation = false;
    // if (pathname === '/Home' && search === '?signin') fromActivation = true;
    const { label, open, anchorEl } = this.state;
    return (
      <div>
        <AppBar
          title="Matcha"
          iconElementRight={<FlatButton label={label}/>}
          onRightIconButtonTouchTap={this.handleRightTouchTap}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onRequestClose={this.handleRequestClose}
          children={<Signin onLog={this.onLog} setLoading={this.setLoading}/>}
        />
      </div>
    );
  }
}

export default withRouter(Header);

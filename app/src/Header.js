import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Signin from './Signin';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loading: false,
    };
    this.CloseRight = this.CloseRight.bind(this);
    this.onLog = this.onLog.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.navigate = this.navigate.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);
  }


  renderRightIcon() {
    return (
      !this.props.loggued ?
      <FlatButton
        label='signin'
      /> :
      <IconButton><MoreVertIcon /></IconButton>
    );
  }

  setLoading(loading) {
    this.setState({loading})
  }

  CloseRight() {
    if (!this.state.loading) this.setState({open: false});
  }

  onLog(user) {
    this.setState({open: false});
    setTimeout(() => {this.props.onLog(user)}, 1000);
  }

  navigate(e, item, i) {
    const { history } = this.props;
    this.setState({open: false});
    switch (i) {
      case 0:
        history.push('/');
        break;

      case 1:
        history.push('/profile/' + this.props.loggued);
        break;

      case 2:
        setTimeout(() => {
          localStorage.removeItem('c_user');
          this.props.onLogout();
        }, 1000);
        break;

      default: break;
    }
  }

  render() {
    const { loggued } = this.props;
    const { anchor, open } = this.state;
    return (
      <div>
        <AppBar
          title="Matcha"
          iconElementLeft={<div></div>}
          iconElementRight={this.renderRightIcon()}
          onRightIconButtonTouchTap={e => {this.setState({open: true, anchor: e.currentTarget})}}
        />
        <Popover
          open={open}
          anchorEl={anchor}
          onRequestClose={this.CloseRight}
        >
          {loggued ?
          <Menu onItemTouchTap={this.navigate}>
            <MenuItem name='menu1' primaryText="Suggestion" />
            <MenuItem name='menu2' primaryText="Profile" />
            <MenuItem name='menu3' primaryText="Logout" />
          </Menu> :
          <Signin
            onLog={this.onLog}
            setLoading={this.setLoading}
            history={this.props.history}
          />}
        </Popover>
      </div>
    );
  }
}

export default withRouter(Header);

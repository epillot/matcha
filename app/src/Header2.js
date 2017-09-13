import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Signin from './Signin';
import IconButton from 'material-ui/IconButton';
import RightNav from './RightNav';
import GroupIcon from 'material-ui/svg-icons/social/people';


const styles = {
  rightNav: {
    float: 'left',
    height: '64px',
  },
  signin: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  }
}

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

  render() {
    const { loggued, history } = this.props;
    const { anchor, open } = this.state;
    return (
      <div>
        <AppBar
          style={{position: 'fixed', top: '0'}}
          title="Matcha"
          iconElementLeft={<IconButton><GroupIcon/></IconButton>}
          showMenuIconButton={!!loggued}
          onLeftIconButtonTouchTap={() => history.push('/')}
        >
          <div style={styles.rightNav}>
            {!loggued ?
            <div style={styles.signin}>
              <RaisedButton
                label='signin'
                secondary={true}
                onTouchTap={e => {
                  this.setState({open: true, anchor: e.currentTarget});
                }}
              />
              <Popover
                open={open}
                anchorEl={anchor}
                onRequestClose={this.CloseRight}
              >
                <Signin
                  onLog={this.onLog}
                  setLoading={this.setLoading}
                  history={this.props.history}
                />
              </Popover>
            </div> :
            <RightNav
              onLogout={this.props.onLogout}
              history={this.props.history}
              user={loggued}
            />}
          </div>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Header);

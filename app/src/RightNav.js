import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import NotifIcon from './NotifIcon';
import ProfileIcon from 'material-ui/svg-icons/social/person';
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import secureRequest from './secureRequest';
import NotifDisplayer from './NotifDisplayer';

const styles = {
  icons: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    width: '30px',
    height: '30px',
    color: '#FFFFFF',
  },
  logout: {
    width: '30px',
    height: '30px',
  },
  small: {
    width: '60px',
    height: '60px',
    padding: '15px',
  },
}

export default class extends Component {

  constructor() {
    super();
    this.state = {
      count: 0,
      notif: [],
      open: false,
      newNotif: false,
      loading: false,
    }
    this.mounted = true;
    this.logout = this.logout.bind(this);
    this.getNotif = this.getNotif.bind(this);
    this.closeNotif = this.closeNotif.bind(this);
    this.delNotif = this.delNotif.bind(this);
    this.setAsRead = this.setAsRead.bind(this);
  }

  componentDidMount() {
    global.socket.on('notif', () => {
      this.setState(state => {
        state.count++;
        state.newNotif = true;
        return state;
      });
    });
    const config = {
      method: 'get',
      url: '/api/notifications'
    };
    secureRequest(config, (err, response) => {
      if (err) return this.props.onLogout();
      const { notif } = response.data;
      let count = 0;
      notif.forEach(n => {
        if (!n.read) count++;
      });
      this.setState({notif, count});
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  logout() {
    setTimeout(() => {
      localStorage.removeItem('c_user');
      this.props.onLogout();
    }, 500);
  }

  notifExist(notifs, id) {
    for (let i = 0; i < notifs.length; i++) {
      if (notifs[i]._id === id) return true;
    }
    return false;
  }

  getNotif(elem) {
    this.setState({open: true, anchor: document.getElementById('notif'), count: 0});
    if (this.state.newNotif) {
      this.setState({loading: true})
      const config = {
        method: 'get',
        url: '/api/notifications/unread',
      };
      secureRequest(config, (err, response) => {
        setTimeout(() => {
          if (err) return this.props.onLogout();
          const { notifUnread } = response.data;
          this.setState(state => {
            notifUnread.forEach(n => {
              if (!this.notifExist(state.notif, n._id)) {
                state.notif.push(n)
              }
            });
            state.loading = false;
            state.newNotif = false;
            return state;
          });
          this.setAsRead();
        }, 500);
      });
    } else if (this.state.count) this.setAsRead();
  }

  setAsRead(cb) {
    const config = {
      method: 'patch',
      url: '/api/notifications'
    };
    secureRequest(config, err => {
      if (err) return this.props.onLogout();
      if (cb) cb();
    });
  }

  delNotif(id) {
    const { notif } = this.state;
    for (var i = 0; i < notif.length; i++) {
      if (notif[i]._id === id) break;
    }
    if (i < notif.length) {
      notif.splice(i, 1);
      this.setState({notif});
    }
  }

  closeNotif() {
    if (!this.state.loading) {
      const { notif } = this.state;
      notif.forEach(n => n.read = true);
      this.setState({notif, open: false});
    }
  }

  render() {
    const { open, count, anchor, notif, loading } = this.state;
    const { history, user } = this.props;
    return (
      <div style={styles.icons}>
        <div id='notif'>
          <NotifIcon
            count={count}
            onTouchTap={this.getNotif}
            onLogout={this.props.onLogout}
          />
        </div>
        <NotifDisplayer
          open={open}
          notifs={notif}
          anchor={anchor}
          loading={loading}
          closeNotif={this.closeNotif}
          delNotif={this.delNotif}
          getNotif={this.getNotif}
          history={history}
        />
        <IconButton
          iconStyle={styles.icon}
          style={styles.small}
          onTouchTap={() => history.push('/message')}
          tooltip='Chat'
        >
          <ChatIcon/>
        </IconButton>
        <IconButton
          iconStyle={styles.icon}
          style={styles.small}
          onTouchTap={() => history.push('/profile/' + user)}
          tooltip='My profile'
        >
          <ProfileIcon/>
        </IconButton>
        <IconButton
          iconStyle={styles.logout}
          style={styles.small}
          onTouchTap={this.logout}
          tooltip='logout'
        >
          <LogoutIcon/>
        </IconButton>
      </div>
    );
  }
}

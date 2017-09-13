import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import NotifIcon from './NotifIcon';
import ProfileIcon from 'material-ui/svg-icons/social/person';
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new';
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
      loading: false,
    }
    this.mounted = true;
    this.logout = this.logout.bind(this);
    this.getNotif = this.getNotif.bind(this);
    this.closeNotif = this.closeNotif.bind(this);
  }

  componentDidMount() {
    const config = {
      method: 'get',
      url: '/api/notifications/count'
    };
    secureRequest(config, (err, response) => {
      if (err) return this.props.onLogout();
      const { count } = response.data;
      this.setState({count});
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

  getNotif(e) {
    this.setState({open: true, anchor: e.currentTarget});
    if (this.state.count) {
      this.setState({loading: true})
      const config = {
        method: 'get',
        url: '/api/notifications',
      };
      secureRequest(config, (err, response) => {
        setTimeout(() => {
          if (err) return this.props.onLogout();
          const { notif } = response.data;
          notif.sort((n1, n2) => {
            return n2.ts - n1.ts
          });
          this.setState({notif, loading: false});
        }, 500);
      });
    }
  }

  closeNotif() {
    if (!this.state.loading) this.setState({open: false});
  }

  render() {
    const { open, count, anchor, notif, loading } = this.state;
    const { history, user } = this.props;
    const profilePath = '/profile/' + user;
    return (
      <div style={styles.icons}>
        <NotifIcon
          count={count}
          onTouchTap={this.getNotif}
        />
        <NotifDisplayer
          open={open}
          notifs={notif}
          anchor={anchor}
          loading={loading}
          closeNotif={this.closeNotif}
        />
        <IconButton
          iconStyle={styles.icon}
          style={styles.small}
          onTouchTap={() => history.push(profilePath)}
        >
          <ProfileIcon/>
        </IconButton>
        <IconButton
          iconStyle={styles.logout}
          style={styles.small}
          onTouchTap={this.logout}
        >
          <LogoutIcon/>
        </IconButton>
      </div>
    );
  }
}

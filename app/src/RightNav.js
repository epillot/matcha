import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import NotifIcon from 'material-ui/svg-icons/social/notifications';
import ProfileIcon from 'material-ui/svg-icons/social/person';
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new';

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
    this.logout = this.logout.bind(this);
    this.mounted = true;
  }

  componentDidMount() {
    global.socket.on('notif', notif => {
      console.log(notif);
    })
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

  render() {
    const { history, user } = this.props;
    const profilePath = '/profile/' + user;
    return (
      <div style={styles.icons}>
        <IconButton
          iconStyle={styles.icon}
          style={styles.small}
        >
          <NotifIcon/>
        </IconButton>
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

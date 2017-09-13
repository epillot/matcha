import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import ReloadIcon from 'material-ui/svg-icons/notification/sync';
import Subheader from 'material-ui/Subheader';

const styles = {
  popover: {
    minWidth: '250px',
    maxHeight: '350px',
    minHeight: '200px',
    padding: '15px',
  },
  notifHeader: {
    display: 'flex',
    justifyContent: 'spaceBetween',
  },
  read: {
    backgroundColor: '#FFFFFF',
  },
  unread: {
    backgroundColor: '#E0E0E0',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '8px',
  }
}

export default class extends Component {

  constructor() {
    super();
    this.renderNotif = this.renderNotif.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.getTime = this.getTime.bind(this);
  }

  getMessage(notif) {
    switch (notif.object) {
      case 'visit': return `${notif.from.login} visited your profile.`
      default: return '';
    }
  }


  getTime(ts) {
    let offset = Math.floor(ts / 1000 / 60);
    if (offset < 1) return 'now';
    if (offset < 60) return offset + 'mn';
    offset = Math.floor(offset / 60);
    if (offset < 24) return offset + 'h';
    offset = Math.floor(offset / 24);
    if (offset === 1) return '1day';
    return offset + 'days';
  }

  renderNotif(notifs) {
    return (
      notifs.map(notif => (
        <div key={notif._id}>
          <ListItem
            style={notif.read ? styles.read : styles.unread}
            leftAvatar={<Avatar src={`/static/${notif.from.pp}`}/>}
            primaryText={this.getMessage(notif)}
            secondaryText={this.getTime(Date.now() - notif.ts)}
            rightIconButton={
              <IconButton
                onTouchTap={() => this.props.delNotif(notif._id)}
              >
                <ClearIcon/>
              </IconButton>}
          />
          <Divider/>
        </div>
      ))
    )
  }

  render() {
    const { open, notifs, anchor, loading } = this.props;
    notifs.sort((n1, n2) => n2.ts - n1.ts)
    return (
      <Popover
        open={open}
        anchorEl={anchor}
        onRequestClose={this.props.closeNotif}
      >
        <div style={styles.notifHeader}>
          <Subheader>Notifications</Subheader>
          <IconButton
            onTouchTap={this.props.getNotif}
          >
            <ReloadIcon/>
          </IconButton>
        </div>
        <Divider/>
        <List style={styles.popover}>
          <div style={styles.loading}>
            {loading ? <CircularProgress size={20} color={'#BDBDBD'}/> : ''}
          </div>
          {notifs.length ? this.renderNotif(notifs) :
            !loading ? 'You don\'t have any notifications.' : ' '}
        </List>
      </Popover>
    );
  }
}

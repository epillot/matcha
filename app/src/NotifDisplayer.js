import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';

const styles = {
  popover: {
    minWidth: '250px',
    maxHeight: '350px',
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
        <div key={notif.ts + notif.from.login}>
        <ListItem
          leftAvatar={<Avatar src={`/static/${notif.from.pp}`}/>}
          primaryText={this.getMessage(notif)}
          secondaryText={this.getTime(Date.now() - notif.ts)}
        />
        <Divider/>
        </div>
      ))
    )
  }

  render() {
    const { open, notifs, anchor, loading } = this.props;
    return (
      <Popover
        open={open}
        anchorEl={anchor}
        onRequestClose={this.props.closeNotif}
      >
        <div>{loading ? <CircularProgress/> : ''}</div>
        <List style={styles.popover}>
          {notifs.length ? this.renderNotif(notifs) :
            !loading ? 'You don\'t have any notifications.' : ' '}
        </List>
      </Popover>
    );
  }
}

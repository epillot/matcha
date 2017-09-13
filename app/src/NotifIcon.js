import React from 'react';
import Notif from 'material-ui/svg-icons/social/notifications';
import NotifNone from 'material-ui/svg-icons/social/notifications-none';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';

const styles = {
  icon: {
    width: '30px',
    height: '30px',
    color: '#FFFFFF',
  },
  small: {
    width: '60px',
    height: '60px',
    padding: '16px',
  },
  badge: {
    padding: '0px',
  }
}

export default function(props) {

  if (!props.count) {
    return (
      <IconButton
        onTouchTap={props.onTouchTap}
        iconStyle={styles.icon}
        style={styles.small}
      >
        <NotifNone/>
      </IconButton>
    );
  } else {
    return (
      <Badge
        style={styles.badge}
        badgeContent={props.count}
        secondary={true}
      >
        <IconButton
          onTouchTap={props.onTouchTap}
          iconStyle={styles.icon}
          style={styles.small}
        >
          <Notif/>
        </IconButton>
      </Badge>
    );
  }

}

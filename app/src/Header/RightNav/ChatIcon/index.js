import React from 'react';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ChatIcon from 'material-ui/svg-icons/communication/chat';

const styles = {
  icon: {
    width: '30px',
    height: '30px',
    color: '#FFFFFF',
  },
  small: {
    width: '60px',
    height: '60px',
    padding: '20px',
  },
  badge: {
    padding: '0px',
  }
}

export default function(props) {

  if (!props.newMsg) {
    return (
      <IconButton
        onTouchTap={props.onTouchTap}
        iconStyle={styles.icon}
        style={styles.small}
        tooltip='Chat'
      >
        <ChatIcon/>
      </IconButton>
    );
  } else {
    return (
      <Badge
        style={styles.badge}
        badgeContent={'new'}
        secondary={true}
      >
        <IconButton
          onTouchTap={props.onTouchTap}
          iconStyle={styles.icon}
          style={styles.small}
          tooltip='Chat'
        >
          <ChatIcon/>
        </IconButton>
      </Badge>
    );
  }

}

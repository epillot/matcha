import React from 'react';
import NoMsgIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';
import NewMessageIcon from 'material-ui/svg-icons/communication/chat-bubble';
import Badge from 'material-ui/Badge';

export default function(props) {
  if (!props.count) {
    return <NoMsgIcon/>
  } else {
    return (
      <Badge
        style={{padding: '10px'}}
        secondary={true}
        badgeContent={'!'}
        badgeStyle={{width: '18px', height: '18px'}}
      >
        <NewMessageIcon/>
      </Badge>
    );
  }
}

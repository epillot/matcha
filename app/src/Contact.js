import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import NoMsgIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';
import NewMsgIcon from 'material-ui/svg-icons/communication/message';


const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#EEEEEE',
  },
}

function getMsgIcon(asNew) {
  if (!asNew) return <NoMsgIcon color='#BDBDBD'/>
  return <NewMsgIcon color='#9E9E9E'/>
}

export default function(props) {
  const { contacts, history, selected, convLoading } = props;
  if (contacts !== null) {
    return (
      <List style={{padding: '0px'}}>
       {contacts.sort((m1, m2) => m1.logged ? -1 : m2.logged ? 1 : 0).map(contact => (
         <div key={contact._id}>
           <ListItem
             style={contact === selected ? styles.selected : {}}
             children={<div key={contact._id} style={{float : 'right'}}>{getMsgIcon(!!contact.unreadMsgCount)}</div>}
             secondaryText={contact.logged ? 'online' : 'offline'}
             primaryText={contact.login}
             hoverColor='#F5F5F5'
             leftAvatar={<Avatar src={`/static/${contact.profilePic}`}/>}
             onTouchTap={() => history.push('?' + contact._id)}
             disabled={convLoading || contact === selected}
           />
         </div>
       ))}
      </List>
    );
  } else return (
    <div style={styles.loading}>
      <CircularProgress/>
    </div>
  );
}

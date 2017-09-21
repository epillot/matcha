import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import LogIcon from 'material-ui/svg-icons/image/lens';

const styles = {
  logicon: {
    width: '15px',
    height: '15px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#E0E0E0',
  },
}

export default function(props) {
  const { contacts, history, selected } = props;
  if (contacts !== null) {
    return (
      <List>
       {contacts.sort((m1, m2) => m1.logged ? -1 : m2.logged ? 1 : 0).map(contact => (
         <div key={contact._id}>
           <ListItem
             style={contact === selected ? styles.selected : {}}
             rightIcon={<LogIcon style={styles.logicon} color={contact.logged ? '#8BC34A' : '#E53935'}/>}
             primaryText={contact.login}
             leftAvatar={<Avatar src={`/static/${contact.profilePic}`}/>}
             onTouchTap={() => history.push('?' + contact._id)}
             disabled={contact === selected}
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

import React, { Component } from 'react';
import secureRequest from './secureRequest';
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
}

export default class extends Component {

  constructor() {
    super();
    this.state = {
      contacts: null,
    };
  }

  async componentDidMount() {
    const config = {
      method: 'get',
      url: '/api/chat/contacts',
    };
    try {
      const { data: { contacts } } = await secureRequest(config);
      this.setState({contacts});
    } catch(e) {
      if (e === 'Unauthorized') this.props.onAuthFailed();
      else console.log(e);
    }
  }

  render() {
    const { contacts } = this.state;
    if (contacts !== null) return (
      <List>
       {contacts.sort((m1, m2) => m1.logged ? -1 : m2.logged ? 1 : 0).map(contact => (
         <div key={contact._id}>
           <ListItem
             rightIcon={<LogIcon style={styles.logicon} color={contact.logged ? '#8BC34A' : '#E53935'}/>}
             primaryText={contact.login}
             leftAvatar={<Avatar src={`/static/${contact.profilePic}`}/>}
           />
         </div>
       ))}
      </List>
    );
    else return (
      <div style={styles.loading}>
        <CircularProgress/>
      </div>
    );
  }

}

import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Contact from './Contact/';
import Messages from './Messages/';
import secureRequest from '../secureRequest';


const styles = {
  root: {
    padding: '50px',
    height: '70vh',
  },
  container: {
    margin: 'auto',
    display: 'flex',
    width: '80%',
    height: '100%',
    minWidth: '800px',
    minHeight: '500px',
    maxWidth: '1200px',
    maxHeight: '750px',
    border: '3px solid #E0E0E0',
  },
  contact: {
    height: '100%',
    width: '30%',
    borderRight: '3px solid #E0E0E0',
    overflowY: 'auto',

  },
  contactHeader: {
    height: '10%',
    borderBottom: '3px solid #E0E0E0',
  }
}

export default class extends Component {


  constructor(props) {
    super(props);
    this.state = {
      contacts: null,
      conv: null,
    }
    this.mounted = true;
    this.setStateIfMounted = this.setStateIfMounted.bind(this);
    this.getContacts = this.getContacts.bind(this);
    this.getConv = this.getConv.bind(this);
    this.onSend = this.onSend.bind(this);
    this.setAsRead = this.setAsRead.bind(this);
    this.onSendFailed = this.onSendFailed.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setStateIfMounted(state, cb) {
    if (this.mounted) this.setState(state, cb);
  }

  componentWillReceiveProps(props) {
    const actualQuery = this.props.location.search.substring(1);
    const newQuery = props.location.search.substring(1);
    if (actualQuery !== newQuery) {
      this.setStateIfMounted({conv: null});
      this.getConv(newQuery);
    }
  }

  getContacts() {
    const config = {
      method: 'get',
      url: '/api/chat/contacts',
    };
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { contacts } } = await secureRequest(config);
        this.setStateIfMounted({contacts}, () => resolve());
      } catch(e) { reject(e) }
    });
  }

  async getConv(query) {
    const { contacts } = this.state;
    let validQuery = false;
    if (query) {
      contacts.forEach(contact => {
        if (contact._id === query) validQuery = true;
      });
    }
    if (validQuery) {
      const config = {
        method: 'get',
        url: '/api/chat/messages/' + query,
      };
      try {
        const { data: { conv, error } } = await secureRequest(config);
        if (error) this.setStateIfMounted({conv: false});
        else {
          this.setAsRead(query);
          this.setStateIfMounted(state => {
            const contacts = state.contacts.slice();
            let allRead = true;
            contacts.forEach(contact => {
              if (contact._id === query) contact.unreadMsgCount = 0;
              else if (contact.unreadMsgCount !== 0) {
                allRead = false;
              }
            });
            if (allRead) this.props.onRead();
            return {conv, contacts}
          });
          const container = document.getElementById('msg');
          container.scrollTop = container.scrollHeight;
        }
      } catch(e) {
        if (e === 'Unauthorized') this.props.onAuthFailed();
        else console.log(e);
      }
    } else this.setStateIfMounted({conv: false});
  }

  setAsRead(idConv, cb) {
    const config = {
      method: 'patch',
      url: '/api/chat/messages/' + idConv,
    };
    secureRequest(config, err => {
      if (err) return this.props.onAuthFailed();
      if (cb) cb();
    });
  }

  componentDidMount() {
    const query = this.props.location.search.substring(1);
    this.getContacts().then(() => {
      const ids = [];
      this.state.contacts.forEach(contact => {
        ids.push(contact._id);
      });
      global.socket.emit('join chat', {ids});
      this.getConv(query)
    });
    global.socket.on('changelog', ({ id, status, ts }) => {
      this.setStateIfMounted(state => {
        const contactsUp = state.contacts.slice();
        contactsUp.forEach(contact => {
          if (contact._id === id) {
            contact.logged = status;
            contact.ts = ts;
          }
        });
        return {contacts: contactsUp}
      })
    });
    global.socket.on('message', ({ msg }) => {
      const selected = this.props.location.search.substring(1);
      if (selected === msg.idSender) {
        this.onSend(msg);
        this.setAsRead(msg.idSender);
      } else {
        this.setStateIfMounted(state => {
          if (state.contacts) {
            const contacts = state.contacts.slice();
            contacts.forEach(contact => {
              if (msg.idSender === contact._id) contact.unreadMsgCount++;
            });
            return {contacts};
          }
        });
      }
    });
  }

  onSend(msg) {
    this.setStateIfMounted(state => {
      const conv = state.conv.slice();
      conv.push(msg);
      return {conv}
    });
    const container = document.getElementById('msg');
    if (container) container.scrollTop = container.scrollHeight;
  }

  onSendFailed(idContact) {
    this.setStateIfMounted(state => {
      const contacts = state.contacts.slice();
      let i;
      for (i = 0; i < contacts.length; i++) {
        if (contacts[i]._id === idContact) break;
      }
      contacts.splice(i, 1);
      return {contacts, conv: false}
    });
  }

  render() {
    const { contacts, conv } = this.state;
    const query = this.props.location.search.substring(1);
    let selected = false;
    if (contacts && query) {
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i]._id === query) selected = contacts[i];
      }
    }
    return (
      <div style={styles.root}>
      <Paper style={styles.container}>
        <div style={styles.contact}>
          <Contact
            convLoading={conv === null}
            contacts={contacts}
            selected={selected}
            history={this.props.history}
          />
        </div>
        <div style={{width: '70%'}}>
          <Messages
            selected={selected}
            conv={conv}
            onAuthFailed={this.props.onLogout}
            onSend={this.onSend}
            onSendFailed={this.onSendFailed}
          />
        </div>
      </Paper>
      </div>
    );
  }

}

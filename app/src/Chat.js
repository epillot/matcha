import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Contact from './Contact';
import Messages from './Messages';
import secureRequest from './secureRequest';

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
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setStateIfMounted(state) {
    if (this.mounted) this.setState(state);
  }

  componentDidMount() {
    let config = {
      method: 'get',
      url: '/api/chat/contacts',
    };
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err) return this.props.onLogout();
        const { contacts } = response.data;
        this.setStateIfMounted({contacts});
      }, 2000);
    });

    const query = this.props.location.search.substring(1);
    //console.log(query);
    if (query) {
      config = {
        method: 'get',
        url: '/api/chat/messages/' + query,
      };
      secureRequest(config, (err, response) => {
        if (err) return this.props.onLogout();
        const { conv, error } = response.data;
        if (error) this.setStateIfMounted({conv: false});
        else this.setStateIfMounted({conv});
      })
    } else this.setStateIfMounted({conv: false});
  }

  render() {
    const { contacts, conv } = this.state;
    return (
      <div style={styles.root}>
      <Paper style={styles.container}>
        <div style={styles.contact}>
          <Subheader>Contacts</Subheader>
          <Divider/>
          <Contact
            contacts={contacts}
            history={this.props.history}
            onAuthFailed={this.props.onLogout}
          />
        </div>
        <Messages
          conv={conv}
          onAuthFailed={this.props.onLogout}
          location={this.props.location}
        />
      </Paper>
      </div>
    );
  }

}

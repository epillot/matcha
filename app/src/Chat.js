import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Contact from './Contact';
import Messages from './Messages';

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
    minWidth: '600px',
    minHeight: '400px',
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
      conv: this.getConvParam(props),
    }
    this.getConvParam = this.getConvParam.bind(this);
  }

  getConvParam(props) {
    const query = props.location.search.substring(1).split('=');
    if (query[0] !== 'conv') return null;
    return query[1] || null;
  }

  render() {
    console.log(this.state.conv);
    return (
      <div style={styles.root}>
      <Paper style={styles.container}>
        <div style={styles.contact}>
          <Subheader>Contacts</Subheader>
          <Divider/>
          <Contact/>
        </div>
        <Messages/>
      </Paper>
      </div>
    );
  }

}

import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  fullContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgContainer: {
    width: '100%',
    height: '70%',
  },
  msgForm: {
    boxSizing: 'border-box',
    padding: '10px',
    overflowY: 'auto',
    width: '100%',
    height: '30%',
  },
}

export default class extends Component {


  render() {
    const { conv } = this.props;
    if (conv === false) return (
      <div style={styles.fullContainer}>
        Select a contact to start a conversation
      </div>
    );
    else if (conv === null) return (
      <div style={styles.fullContainer}>
        <CircularProgress/>
      </div>
    );
    return (
      <div style={{height: '100%', width: '100%'}}>
        <div style={styles.msgContainer}>
        </div>
        <Divider/>
        <div style={styles.msgForm}>
          <TextField
            fullWidth={true}
            multiLine={true}
            rowsMax={4}
            hintText='Type your message here'
          />
          <RaisedButton label="send" primary={true} style={{float: 'right'}}/>
        </div>
      </div>
    );
  }

}

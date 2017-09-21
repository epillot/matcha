import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import ChangeLog from './ChangeLog';
import {List, ListItem} from 'material-ui/List';

const styles = {
  fullContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  convHeader: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '15%',
    alignItems: 'center',
    //backgroundColor: '#ECEFF1'
  },
  avatar: {
    marginRight: '5px',
  },
  msgContainer: {
    width: '100%',
    height: '65%',
    overflowY: 'auto',
  },
  msgForm: {
    boxSizing: 'border-box',
    padding: '10px',
    width: '100%',
    height: '20%',
  },
  usermsg: {
    textAlign: 'right',
  },
  othermsg: {
    textAlign: 'left',
  },
}

export default class extends Component {

  constructor() {
    super();
    this.state = {
      message: '',
      error: '',
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.renderMsg = this.renderMsg.bind(this);
  }

  async sendMessage() {
    const { message } = this.state;
    const idTarget = this.props.selected._id;
    const ts = Date.now();
    const config = {
      method: 'post',
      url: '/api/chat/message',
      data: {idTarget, message, ts},
    };
    try {
      const { data: { error, chatmsg } } = await secureRequest(config);
      if (error) return this.setState({error});
      this.setState({message: ''})
      this.props.onSend(chatmsg);
    } catch(e) {
      if (e === 'Unauthorized') this.props.onAuthFailed();
      else console.log(e);
    }
  }

  renderMsg() {
    const { conv, selected } = this.props;
    return (
      conv.map(msg => (
        <div
          key={msg._id}
        >
          <div style={msg.idSender === selected._id ? styles.othermsg : styles.usermsg}>
            <p></p>
            <p>{msg.content}</p>
          </div>
        </div>
      ))
    );
  }

  render() {
    const { conv, selected } = this.props;
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
    const { message, error } = this.state;
    return (
      <div style={{height: '100%', width: '100%'}}>
        <div style={styles.convHeader}>
          <Avatar
            size={50}
            src={`/static/${selected.profilePic}`}
            style={styles.avatar}
          />
          <ChangeLog
            logged={selected.logged}
            ts={selected.ts}
            id={selected._id}
          />
        </div>
        <Divider/>
        <div style={styles.msgContainer}>
          {this.renderMsg(conv)}
        </div>
        <Divider/>
        <div style={styles.msgForm}>
          <TextField
            value={message}
            onChange={e => this.setState({message: e.target.value})}
            onSelect={() => this.setState({error: ''})}
            fullWidth={true}
            hintText='Type your message here'
            errorText={error}
          />
          <RaisedButton
            label="send"
            primary={true}
            style={{float: 'right'}}
            onTouchTap={this.sendMessage}
          />
        </div>
      </div>
    );
  }

}

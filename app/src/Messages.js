import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import ChangeLog from './ChangeLog';

const styles = {
  fullContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  convHeader: {
    borderBottom: '3px solid #E0E0E0',
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
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  },
  msgForm: {
    boxSizing: 'border-box',
    padding: '0px 10px 0px 10px',
    width: '100%',
    height: '20%',
    borderTop: '3px solid #E0E0E0',
    //backgroundColor: '#ECEFF1'
  },
  usermsg: {
    paddingTop: '10px',
    maxWidth: '60%',
    minWidth: '30%',
    //minWidth: '20%',
    alignSelf: 'flex-end',
  },
  othermsg: {
    paddingTop: '10px',
    maxWidth: '60%',
    minWidth: '30%',
    //minWidth: '20%',
    alignSelf: 'flex-start',
  },
  msgData1: {
    textAlign: 'right',
    marginRight: '10px',
  },
  msgData2: {
    textAlign: 'left',
    marginLeft: '10px',
  },
  msgSender:{
    fontWeight: 'bold',
    fontSize: '16px',
  },
  msgTime: {
    //fontStyle: 'italic',
    fontSize: '14px',
    color: 'grey',
  },
  msgbox1: {
    boxSizing: 'border-box',
    backgroundColor: '#94C2ED',
    width: '100%',
    wordWrap: 'break-word',
    lineHeight: '26px',
    fontSize: '16px',
    borderRadius: '7px',
    padding: '18px 20px',
    color: 'white',
    fontWeight: 'bold',
  },
}

styles.msgbox2 = Object.assign({}, styles.msgbox1);
styles.msgbox2.backgroundColor = '#86BB71';

export default class extends Component {

  constructor() {
    super();
    this.state = {
      message: '',
      error: '',
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.renderMsg = this.renderMsg.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  getTime(ts) {
    const now = new Date();
    const msgTime = new Date(ts);
    const isToday = now.getDay() === msgTime.getDay() &&
                    now.getDate() === msgTime.getDate() &&
                    now.getFullYear() === msgTime.getFullYear()
    if (isToday) return 'today ' + msgTime.toLocaleTimeString().substring(0, 5);
    return msgTime.toLocaleString().substring(0, 9);
  }

  async sendMessage() {
    const message = this.state.message.trim();
    if (!message.length) return;
    const idTarget = this.props.selected._id;
    const ts = Date.now();
    const config = {
      method: 'post',
      url: '/api/chat/message',
      data: {idTarget, message, ts},
    };
    try {
      const { data: { error, chatmsg } } = await secureRequest(config);
      if (error === 'nomatch') return this.props.onSendFailed(idTarget);
      else if (error) return this.setState({error});
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
      conv.map(msg => {
        return (
          <div
            key={msg._id}
            style={msg.idSender === selected._id ? styles.othermsg : styles.usermsg}
          >
            <div
              style={msg.idSender === selected._id ? styles.msgData2 : styles.msgData1}
            >
              <span
                style={styles.msgSender}
              >
                {msg.idSender === selected._id ? selected.login : 'you'}
              </span>
              <span style={styles.msgTime}>{' ' + this.getTime(msg.ts)}</span>
            </div>
            <div
              style={msg.idSender === selected._id ? styles.msgbox2 : styles.msgbox1}
            >
              {msg.content.trim()}
            </div>
          </div>
        );
      })
    );
  }

  renderButton() {
    const { length } = this.state.message.trim();
    if (length > 0 && length < 400) {
      return (
        <FlatButton
          labelStyle={{fontWeight: 'bold', color: '#94C2ED'}}
          label='send'
          onTouchTap={this.sendMessage}
        />
      );
    } else {
      return (
        <FlatButton
          labelStyle={{fontWeight: 'bold'}}
          label='send'
          disabled={true}
        />
      );
    }
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
        <div style={styles.msgContainer} id='msg'>
          {this.renderMsg(conv)}
        </div>
        <div style={styles.msgForm}>
          <TextField
            value={message}
            onChange={e => this.setState({message: e.target.value})}
            onSelect={() => this.setState({error: ''})}
            fullWidth={true}
            hintText='Type your message'
            errorText={error}
            underlineFocusStyle={{borderColor: '#94C2ED'}}
            onKeyPress={({ which }) => which === 13 ? this.sendMessage() : null}
          />
          <div style={{float: 'right'}}>
            {this.renderButton()}
          </div>
        </div>
      </div>
    );
  }

}

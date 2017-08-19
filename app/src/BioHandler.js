import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import secureRequest from './secureRequest';
import TextField from 'material-ui/TextField';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bio: props.bio,
    }
    //this.handleAdd = this.handleAdd.bind(this);
    //this.handleClose = this.handleClose.bind(this);
  }

  render() {
    const { bio } = this.state;
    const actions = [
      <FlatButton
        label="Submit"
        primary={true}
        disabled={false}
        onTouchTap={() => {}}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.onClose}
        disabled={false}
      />
    ];
    return (
      <Dialog
        title='Edit your biography'
        open={this.props.open}
        actions={actions}
        modal={true}
      >
        <p>Maximum 400 characters (actually {bio.length} characters)</p>
        <TextField
          onChange={e => this.setState({bio: e.target.value})}
          style={{width: '300px'}}
          id='bio'
          multiLine={true}
          value={bio}
          rowsMax={6}
        />
      </Dialog>
    );
  }
}

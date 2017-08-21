import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import secureRequest from './secureRequest';
import TextField from 'material-ui/TextField';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bio: props.bio,
      error: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const bio = this.state.bio.replace(/[\n ]+/g, ' ');
    if (bio === this.props.bio) return;
    if (bio.length > 400) return this.setState({error: 'Text too long'});
    const config = {
      method: 'patch',
      url: '/api' + this.props.location.pathname,
      data: {
        action: 'editBio',
        data: bio,
      },
    };
    secureRequest(config, (err, response) => {
      if (err) return this.props.onAuthFailed();
      const { error } = response.data;
      if (error) return this.setState({error});
      this.props.onEdit(bio);
    });
  }

  render() {
    const bio = this.state.bio.replace(/[\n ]+/g, ' ');
    const actions = [
      <FlatButton
        label="Submit"
        primary={true}
        disabled={bio.length > 400 || bio === this.props.bio}
        onTouchTap={this.handleSubmit}
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
          floatingLabelText='Tell more about you'
          onChange={e => this.setState({bio: e.target.value})}
          style={{width: '300px'}}
          id='bio'
          multiLine={true}
          value={bio}
          rowsMax={6}
          errorText={this.state.error}
        />
      </Dialog>
    );
  }
}

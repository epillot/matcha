import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import auth from './auth';
import CircularProgress from 'material-ui/CircularProgress';

const style = {
  root: {
    display: 'flex',
  },
  preview: {
    width: '200px',
    height: '200px',
    paddingRight: '10px',
  }
};

export default class extends Component {

  constructor() {
    super();
    this.state = {
      file: [],
      loading: false,
    }
    this.onDrop = this.onDrop.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onDrop(file) {
    this.setState({file})
  }

  handleClose() {
    this.setState({file: [], loading: false});
    this.props.onClose();
  }

  handleSubmit() {
    const { file: [ file ], loading } = this.state;
    if (loading) return;
    this.setState({loading: true});
    const form = new FormData();
    form.append('picture', file);
    const config = {
      method: 'post',
      url: '/api/myprofile/uploads',
      headers: {'Content-Type': 'multipart/form-data'},
      data: form,
    }
    auth.secureRequest(config, (err, { data }) => {
      setTimeout(() => {
        if (err) return this.props.history.push('/signin');
        this.props.onUpload(data);
        this.handleClose();
      }, 1000);
    });
  }

  render() {
    const { file, loading } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
        disabled={loading}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={!file.length || loading}
        onTouchTap={this.handleSubmit}
      />,
    ];
    return (
      <Dialog
        title='Upload some pictures'
        actions={actions}
        modal={true}
        open={this.props.open}
      >
        <div style={style.root}>
          {file.map(pic => <img key={pic.preview} style={style.preview} src={pic.preview} alt=""/>)}
          <Dropzone
            accept='image/*'
            multiple={false}
            onDrop={this.onDrop}
          >
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
          {loading ? <CircularProgress/> : ''}
        </div>
      </Dialog>
    );
  }
}

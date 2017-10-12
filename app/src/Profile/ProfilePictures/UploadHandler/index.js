import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import secureRequest from '../../../secureRequest';
import CircularProgress from 'material-ui/CircularProgress';

const style = {
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  preview: {
    width: '200px',
    height: '200px',
    paddingRight: '10px',
  },
  error: {
    margin: '5px',
    color: 'red',
  },
};

export default class extends Component {

  constructor() {
    super();
    this.state = {
      file: [],
      loading: false,
      error: '',
    }
    this.onDrop = this.onDrop.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onDrop(file) {
    this.setState({file})
  }

  handleClose() {
    this.setState({file: [], loading: false, error: ''});
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
      url: '/api/pictures',
      headers: {'Content-Type': 'multipart/form-data'},
      data: form,
    }
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err) return this.props.onAuthFailed();
        if (response.data.error) {
          return this.setState({
            error: response.data.error,
            loading: false,
            file: [],
          });
        }
        this.props.onUpload(response.data.filename);
        this.handleClose();
      }, 1000);
    });
  }

  render() {
    const { file, loading, error } = this.state;
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
            <p>All images will be resized to 720 * 540. Images that do not respect this ratio will be truncated.</p>
          </Dropzone>
          <p style={style.error}>{error}</p>
          {loading ? <CircularProgress/> : ''}
        </div>
      </Dialog>
    );
  }
}

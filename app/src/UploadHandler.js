import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Paper from 'material-ui/Paper';

export default class extends Component {

  constructor() {
    super();
    this.state = {
      file: [],
    }
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(file) {
    this.setState({file})
    console.log(this.state);
  }

  render() {
    return (
      <Paper zDepth={3} style={{padding: 20}}>
        <Dropzone
          accept='image/*'
          multiple={false}
          onDrop={this.onDrop}
        >
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>

      </Paper>
    );
  }
}

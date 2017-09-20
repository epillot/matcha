import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  fullContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: props.query || null,
      conv: null,
    }
  }

  render() {
    const { conv, query } = this.state;
    if (query === null) return (
      <div style={styles.fullContainer}>
        Select a contact to start a conversation
      </div>
    );
    return (
      <div></div>
    );
  }

}

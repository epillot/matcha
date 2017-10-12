import React, { Component } from 'react';
import Signup from './Signup/';

const styles = {
  h1: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  signupContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}

export default class extends Component {
  render() {
    return (
      <div>
        <h1 style={styles.h1}>Welcome to Matcha</h1>
        <div style={styles.signupContainer}>
          <Signup
            history={this.props.history}
            onSignup={this.props.onSignup}
          />
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pictures: props.pictures || [],
      profilePic: 'default.jpg',
    }
  }

  render() {
    const { pictures, profilePic } = this.state;
    return (
      <div>lilu</div>

    );
  }
}

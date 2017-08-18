import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import { Card, CardText } from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const styles = {
  root: {
    height: '180px',
  },
  text: {
     wordWrap: 'break-word',
  },
  edit: {
    position: 'absolute',
    top: '0',
    right: '0',
  }
}

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bio: props.bio,
    }
  }

  render() {
    let { bio } = this.state;
    bio = bio || 'No biography added yet.';
    return (
      <Card style={styles.root}>
        <Subheader>Biography</Subheader>
        <div style={styles.edit}>
          <IconButton>
            <FontIcon className="material-icons">mode_edit</FontIcon>
          </IconButton>
        </div>
        <CardText style={styles.text}>
        {bio}
        </CardText>
      </Card>
    );
  }
}

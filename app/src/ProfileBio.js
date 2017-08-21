import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import { Card, CardText } from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import BioHandler from './BioHandler';

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
      open: false,
      bio: props.bio,
    }
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit(bio) {
    this.setState({bio, open: false});
  }

  render() {
    const { bio, open } = this.state;
    const bioToDisplay = bio || 'No biography added yet.'
    return (
      <Card style={styles.root}>
        <Subheader>Biography</Subheader>
        <div style={styles.edit}>
          <IconButton
            onTouchTap={() => this.setState({open: true})}
            tooltip='Edit your biography'
          >
            <FontIcon className="material-icons">mode_edit</FontIcon>
          </IconButton>
          <BioHandler
            open={open}
            bio={bio}
            onClose={() => this.setState({open: false})}
            onEdit={this.onEdit}
            location={this.props.location}
            onAuthFailed={this.props.onAuthFailed}
          />
        </div>
        <CardText style={styles.text}>
        {bioToDisplay.split('\n').map((line, i) =>
          <div key={i}>{line}</div>
        )}
        </CardText>
      </Card>
    );
  }
}

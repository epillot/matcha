import React, { Component } from 'react';
import Paper from 'material-ui/Paper'
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import InfoHandler from './InfoHandler';

const styles = {
  root: {
    width: '300px',
    maxWidth: '100%',
  },
  profilePicContainer: {
    width: '300px',
    height: '225px',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
}

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      profile: props.profile,
    };
  }

  render() {
    const { open, profile } = this.state;
    const { pp } = this.props.profile;
    const { firstname, lastname, login, birthday, lookingFor } = profile;
    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    const interestedBy = lookingFor === 'Both' ? 'Men and Women' : lookingFor === 'M' ? 'Men' : 'Women'
    return (
      <Paper style={styles.root}>
        <div style={styles.profilePicContainer}>
          <img style={styles.profilePic} src={`/static/${pp}`}/>
        </div>
        <List>
          <ListItem
            primaryText={`${firstname} ${lastname}`}
            secondaryText={`Alias ${login}`}
            rightIconButton={
              <IconButton
                onTouchTap={() => this.setState({open: true})}
              >
                <FontIcon className="material-icons">mode_edit</FontIcon>
                <InfoHandler
                  open={open}
                  onClose={() => this.setState({open: false})}
                  profile={profile}
                />
              </IconButton>
            }
            disabled={true}
          />
          <ListItem
            primaryText={`Age: ${age}`}
            disabled={true}
          />
          <ListItem
            primaryText={`Interested by: ${interestedBy}`}
            disabled={true}
          />
        </List>
      </Paper>
    );
  }
}

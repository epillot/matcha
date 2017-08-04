import React, { Component } from 'react';
import Paper from 'material-ui/Paper'
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  root: {
    width: 'auto',
    maxWidth: '100%',
    margin: '0 auto',
  },
  profilePicContainer: {
    width: '300px',
    heigth: '225px',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  }
}

export default class extends Component {
  render() {
    const { pp, firstname, lastname, login, sex, birthday, lookingFor } = this.props.profile;
    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    const interestedBy = lookingFor === 'Both' ? 'Men and Women' : lookingFor === 'M' ? 'Men' : 'Women'
    return (
      <Paper style={styles.root}>
        <div style={styles.profilePicContainer}>
          <img style={styles.profilePic} src={`static/${pp}`}/>
        </div>
        <List>
        <ListItem
          primaryText={`${firstname} ${lastname}`}
          secondaryText={`Alias ${login}`}
          rightIconButton={<FontIcon className="material-icons">mode_edit</FontIcon>}
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

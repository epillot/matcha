import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import InfoHandler from './InfoHandler/';

const styles = {
  root: {
    width: '300px',
    maxWidth: '100%',
    marginRight: '10px'
  },
  profilePicContainer: {
    width: '300px',
    height: '225px',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  info: {
    maxHeight: '200px',
    overflowY: 'auto',
  }
}

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      profile: props.profile,
    };
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit(data) {
    const { profile } = this.state;
    data.forEach(({ field, value }) => {
      profile[field] = value;
    });
    this.setState({profile});
  }

  render() {
    const { open, profile } = this.state;
    const { editable } = this.props;
    const { firstname, lastname, login, sexValue, birthday, lookingFor, adress, popularity } = profile;
    const pp = this.props.profile.profilePic || 'default.jpg';
    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    const interestedBy = lookingFor === 3 ? 'men and women' : lookingFor === 2 ? 'women' : 'men'
    const sex = sexValue === 1 ? 'Man' : 'Woman';
    return (
      <Paper style={styles.root} onClick={this.props.onClick}>
        <div style={styles.profilePicContainer}>
          <img style={styles.profilePic} src={`/static/${pp}`} alt=''/>
        </div>
        <List style={styles.info}>
          <ListItem
            primaryText={`${firstname} ${lastname}`}
            secondaryText={`Alias ${login}`}
            rightIconButton={
              editable ?
              <IconButton
                onTouchTap={() => this.setState({open: true})}
                tooltip='Edit your Informations'
                tooltipPosition='bottom-left'
              >
                <FontIcon className="material-icons">mode_edit</FontIcon>
                <InfoHandler
                  open={open}
                  onClose={() => this.setState({open: false})}
                  profile={profile}
                  location={this.props.location}
                  onAuthFailed={this.props.onAuthFailed}
                  onEdit={this.onEdit}
                />
              </IconButton> : null
            }
            disabled={true}
          />
          <ListItem
            primaryText={`${sex}, ${age}`}
            disabled={true}
          />
          <ListItem
            primaryText={`Popularity score: ${popularity}`}
            disabled={true}
          />
          <ListItem
            primaryText={`${adress}`}
            disabled={true}
          />
          <ListItem
            primaryText={`Interested by ${interestedBy}`}
            disabled={true}
          />
        </List>
      </Paper>
    );
  }
}

import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import './form.css';
//import ProfileInfo from './ProfileInfo';
import ProfilePictures from './ProfilePictures';
import ProfileCard from './ProfileCard';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px'
  },
}

export default class extends Component {

  constructor() {
    super();
    this.state = {
      profile: null,
      loading: false,
    }
    this.mounted = true;
    this.setProfilePic = this.setProfilePic.bind(this);
    this.onDeleteProfilePic = this.onDeleteProfilePic.bind(this);
  }

  componentDidMount() {
    const config = {
      method: 'get',
      url: '/api/myprofile',
    };
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err === 'Unauthorized') return this.props.onLogout();
        else if (err) return console.log(err);
        if (this.mounted) {
          this.setState({
            profile: response.data,
          });
        }
      }, 1000);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setProfilePic(pic) {
    const { profile } = this.state;
    profile.profilePic = pic;
    this.setState({profile});
  }

  onDeleteProfilePic() {
    const { profile } = this.state;
    profile.profilePic = null;
    this.setState({profile});
  }

  render() {
    const { profile } = this.state;
    if (profile) {
      const { pictures, profilePic, firstname, lastname, login, ...rest } = profile;
      const pp = profilePic || 'default.jpg';
      return (
        <div style={styles.root}>
          <ProfileCard profile={{pp, firstname, lastname, login, ...rest}}/>
          <ProfilePictures
            onAuthFailed={this.props.onLogout}
            profilePic={pp}
            pictures={pictures}
            user={{firstname, lastname, login}}
            setProfilePic={this.setProfilePic}
            onDeleteProfilePic={this.onDeleteProfilePic}
          />
        </div>
      );
    } else return <CircularProgress/>;
  }
}

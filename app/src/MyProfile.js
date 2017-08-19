import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import ProfileBio from './ProfileBio';
import ProfilePictures from './ProfilePictures';
import ProfileCard from './ProfileCard';
import Interset from './Interest';
import Paper from 'material-ui/Paper';


const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px'
  },
  profileInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  container: {
    width: '430px',
    position: 'relative',
  },
}

export default class extends Component {

  constructor() {
    super();
    this.state = {
      profile: null,
      loading: false,
      error: '',
    }
    this.mounted = true;
    this.setProfilePic = this.setProfilePic.bind(this);
    this.onDeleteProfilePic = this.onDeleteProfilePic.bind(this);
  }

  componentDidMount() {
    console.log(this.props.location);
    const config = {
      method: 'get',
      url: '/api/' + this.props.location.pathname,
    };
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err === 'Unauthorized') return this.props.onLogout();
        else if (err) return console.log(err);
        if (response.data.error) {
          return this.setState({profile: false, error: response.data.error})
        }
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
    if (profile === null) return <CircularProgress/>;
    else if (profile !== false) {
      const { pictures, profilePic, firstname, lastname, login, bio, tags, ...rest } = profile;
      const pp = profilePic || 'default.jpg';
      return (
        <div style={styles.root}>
          <div style={styles.profileInfo}>
            <ProfileCard profile={{pp, firstname, lastname, login, ...rest}}/>
            <div style={styles.container}>
              <ProfileBio bio={bio}/>
              <Interset onAuthFailed={this.props.onLoout} tags={tags} location={this.props.location}/>
            </div>
          </div>
          <ProfilePictures
            location={this.props.location}
            onAuthFailed={this.props.onLogout}
            profilePic={pp}
            pictures={pictures}
            user={{firstname, lastname, login}}
            setProfilePic={this.setProfilePic}
            onDeleteProfilePic={this.onDeleteProfilePic}
          />
        </div>
      );
    } else return <p>{this.state.error}</p>;
  }
}

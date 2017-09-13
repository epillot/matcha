import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import ProfileBio from './ProfileBio';
import ProfilePictures from './ProfilePictures';
import ProfileCard from './ProfileCard';
import Interset from './Interest';
import ChangeLog from './ChangeLog';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px'
  },
  interact: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    this.getProfile = this.getProfile.bind(this);
    this.setProfilePic = this.setProfilePic.bind(this);
    this.onDeleteProfilePic = this.onDeleteProfilePic.bind(this);
  }

  componentDidMount() {
    this.getProfile(this.props.match.params.id);
  }

  componentWillReceiveProps(props) {
    if (props.match.params.id !== this.props.match.params.id) {
      this.setState({profile: null});
      this.getProfile(props.match.params.id);
    }
  }

  getProfile(id) {
    const config = {
      method: 'get',
      url: '/api/profile/' + id,
    };
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err) return this.props.onLogout();
        const { data: { error, profile } } = response;
        if (this.mounted) {
          if (error) this.setState({profile: false, error});
          else {
            this.setState({profile});
            if (id !== this.props.loggued) {
              const data = {
                from: this.props.loggued,
                to: id,
              };
              global.socket.emit('visit', data);
            }
          }
        }
      }, 500);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    const { loggued, match: { params: { id } } } = this.props;
    if (this.state.profile && loggued === id) {
      global.socket.emit('leavelog', {id});
    }
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
    const editable = this.props.loggued === this.props.match.params.id;
    if (profile === null) return <CircularProgress/>;
    else if (profile !== false) {
      const { pictures, profilePic, logged, ts, bio, tags, ...rest } = profile;
      return (
        <div style={styles.root}>
          <div style={styles.interact}>
            <ChangeLog
              ts={ts}
              logged={logged}
              id={profile._id}
            />
          </div>
          <div style={styles.profileInfo}>
            <ProfileCard
              profile={{profilePic, ...rest}}
              location={this.props.location}
              onAuthFailed={this.props.onLogout}
              editable={editable}
            />
            <div style={styles.container}>
              <ProfileBio
                bio={bio}
                onAuthFailed={this.props.onLogout}
                location={this.props.location}
                editable={editable}
              />
              <Interset
                onAuthFailed={this.props.onLogout}
                tags={tags}
                location={this.props.location}
                editable={editable}
              />
            </div>
          </div>
          <ProfilePictures
            editable={editable}
            location={this.props.location}
            onAuthFailed={this.props.onLogout}
            profilePic={profilePic}
            pictures={pictures}
            setProfilePic={this.setProfilePic}
            onDeleteProfilePic={this.onDeleteProfilePic}
          />
        </div>
      );
    } else return <p>{this.state.error}</p>;
  }
}

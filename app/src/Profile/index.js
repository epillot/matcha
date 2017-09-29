import React, { Component } from 'react';
import secureRequest from '../secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import ProfileBio from './ProfileBio/';
import ProfilePictures from './ProfilePictures/';
import ProfileCard from '../ProfileCard/';
import Interset from './Interest/';
import ChangeLog from '../ChangeLog/';
import Interaction from './Interaction/';

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
    this.setStateIfMounted = this.setStateIfMounted.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.updateProfilePic = this.updateProfilePic.bind(this);
  }

  setStateIfMounted(state, cb) {
    if (this.mounted) this.setState(state, cb);
  }

  componentDidMount() {
    this.getProfile(this.props.match.params.id);
  }

  componentWillReceiveProps(props) {
    if (props.match.params.id !== this.props.match.params.id) {
      this.setStateIfMounted({profile: null});
      this.getProfile(props.match.params.id);
    }
  }

  async getProfile(id) {
    let config = {
      method: 'get',
      url: '/api/profile/' + id,
    };
    try {
      const { data: { error, profile } } = await secureRequest(config);
      if (error) this.setStateIfMounted({profile: false, error});
      else {
        global.socket.emit('visit', {id});
        this.setStateIfMounted({profile});
        if (id !== this.props.loggued) {
          config = {
            method: 'post',
            url: '/api/notifications',
            data: {
              to: id,
              object: 'visit',
            },
          };
          secureRequest(config);
        }
      }
    } catch(e) {
      if (e === 'Unauthorized') this.props.onAuthFailed();
      else console.log(e);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    const { loggued, match: { params: { id } } } = this.props;
    if (this.state.profile && loggued === id) {
      global.socket.emit('leavelog', {id});
    }
  }

  updateProfilePic(pic) {
    this.setStateIfMounted({profile: {profilePic: pic}});
  }


  render() {
    const { profile } = this.state;
    const editable = this.props.loggued === this.props.match.params.id;
    if (profile === null) return <CircularProgress/>;
    else if (profile !== false) {
      const { liked, blocked, reported, pictures, profilePic, logged, ts, bio, tags, ...rest } = profile;
      return (
        <div style={styles.root}>
          {editable ? '' :
          <div style={styles.interact}>
            <ChangeLog
              ts={ts}
              logged={logged}
              id={profile._id}
            />
            <Interaction
              id={profile._id}
              liked={liked}
              blocked={blocked}
              reported={reported}
              onAuthFailed={this.props.onLogout}
            />
          </div>}
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
            updateProfilePic={this.updateProfilePic}
          />
        </div>
      );
    } else return <p>{this.state.error}</p>;
  }
}

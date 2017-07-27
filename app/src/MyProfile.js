import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import './form.css';
import ProfileInfo from './ProfileInfo';
import ProfilePictures from './ProfilePictures';
import Paper from 'material-ui/Paper';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  profilePicContainer: {
    width: '300px',
    height: '225px',
    margin: '15px 0 0 30px'
  },
  profilePic: {
    width: '100%',
    height: '100%',
  }
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
        if (err === 'Unauthorized') return this.onAuthFailed();
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
          <Paper style={styles.profilePicContainer} zDepth={1}>
            <img style={styles.profilePic} src={`static/${pp}`} alt=''/>
          </Paper>
          <ProfilePictures
            onAuthFailed={this.props.onLogout}
            profilePic={pp}
            pictures={pictures}
            user={{firstname, lastname, login}}
            setProfilePic={this.setProfilePic}
            onDeleteProfilePic={this.onDeleteProfilePic}
          />
          <ProfileInfo profile={{firstname, lastname, login, ...rest}}/>
        </div>
      );
    } else return <CircularProgress/>;
  }
}

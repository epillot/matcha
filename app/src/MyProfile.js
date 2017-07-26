import React, { Component } from 'react';
import secureRequest from './secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import './form.css';
import {Tabs, Tab} from 'material-ui/Tabs';
import ProfileInfo from './ProfileInfo';
import ProfilePictures from './ProfilePictures';

// const ProfileTab = ({ profile: { pictures, firstname, lastname, login, ...rest } }) => (
//   <Tabs tabItemContainerStyle={{backgroundColor: '#B0BEC5'}}>
//     <Tab label='Pictures'>
//       <ProfilePictures pictures={pictures} user={{firstname, lastname, login}}/>
//     </Tab>
//     <Tab label='Informations'>
//       <ProfileInfo profile={{firstname, lastname, login, ...rest}}/>
//     </Tab>
//   </Tabs>
// );

export default class extends Component {

  constructor() {
    super();
    this.state = {
      profile: null,
      loading: false,
    }
    this.mounted = true;
    this.onAuthFailed = this.onAuthFailed.bind(this);
  }

  onAuthFailed() {
    this.props.onLogout();
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

  render() {
    console.log(this.props);
    const { profile } = this.state;
    if (profile) {
      const { pictures, firstname, lastname, login, ...rest } = profile;
      return (
        <div>
          <ProfilePictures onAuthFailed={this.onAuthFailed} pictures={pictures} user={{firstname, lastname, login}}/>
          <ProfileInfo profile={{firstname, lastname, login, ...rest}}/>
        </div>
      );
    } else return <CircularProgress/>;
  }
}

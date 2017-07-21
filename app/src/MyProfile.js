import React, { Component } from 'react';
import auth from './auth';
import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import './form.css';
// import FontIcon from 'material-ui/FontIcon';
// import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import ProfileInfo from './ProfileInfo';
import ProfilePictures from './ProfilePictures';

const ProfileTab = ({ profile: { pictures, firstname, lastname, login, ...rest } }) => (
  <Tabs tabItemContainerStyle={{backgroundColor: '#B0BEC5'}}>
    <Tab label='Pictures'>
      <ProfilePictures pictures={pictures} user={{firstname, lastname, login}}/>
    </Tab>
    <Tab label='Informations'>
      <ProfileInfo profile={{firstname, lastname, login, ...rest}}/>
    </Tab>
  </Tabs>
);

export default class extends Component {

  constructor() {
    super();
    this.state = {
      profile: null,
      //file: null,
      loading: false,
    }
    this.mounted = true;
    // this.handlePhotoAdd = this.handlePhotoAdd.bind(this);
    // this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    const config = {
      method: 'get',
      url: '/api/myprofile',
    };
    auth.secureRequest(config, (err, { data }) => {
      setTimeout(() => {
        if (err) return this.props.history.push('/signin');
        if (this.mounted) {
          this.setState({
            profile: data,
          });
        }
      }, 1000);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // handlePhotoAdd({ target }) {
  //   const file = target.files[0];
  //   this.setState({file});
  // }
  //
  // handleUpload() {
  //   console.log(this.state.file);
  // }

  render() {
    // const style = {
    //   cursor: 'pointer',
    //   position: 'absolute',
    //   top: 0,
    //   bottom: 0,
    //   right: 0,
    //   left: 0,
    //   width: '100%',
    //   opacity: 0,
    // };
    const { profile } = this.state;
    if (profile) {
      return (
        <Card>
          <CardHeader
            title={profile.login}
            subtitle="Complete or update your profile"
            avatar="static/default.jpg"
          />
          <CardText children={<ProfileTab profile={profile}/>}/>
        </Card>
        //   <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        //   <FlatButton
        //     label='Add a photo'
        //     containerElement='label'
        //     icon={<FontIcon className="material-icons" style={{fontSize: '36px'}}>add_a_photo</FontIcon>}
        //   >
        //     <input type="file" style={style} onChange={this.handlePhotoAdd}/>
        //   </FlatButton>
        //   <FlatButton label='ok' primary={true} disabled={!file} onTouchTap={this.handleUpload}/>
        //   </div>
        //   <CardText children={<ProfileInfo profile={profile}/>}/>
        // </Card>
      )
    } else return <CircularProgress/>;
  }
}

// export default () => (
//   <div className='container'>
//     <MyProfile/>
//   </div>
// );

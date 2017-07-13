import React, { Component } from 'react';
import auth from './auth';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import './form.css';
import Divider from 'material-ui/Divider';
import FormInput from './FormInput';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

class ProfileForm extends Component {

  constructor(props) {
    super(props);
    const {
      firstname,
      lastname,
      login,
      email
    } = props.profile;
    this.state = {
      firstname,
      lastname,
      login,
      email,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  render() {
    const {
      firstname,
      lastname,
      login,
      email
    } = this.state;
    return (
      <form onChange={this.handleChange}>
        <FormInput
          name='firstname'
          value={firstname}
          type='text'
          underlineShow={false}
        ></FormInput>
        <Divider/>
        <FormInput
          name='lastname'
          value={lastname}
          type='text'
          underlineShow={false}
        ></FormInput>
        <Divider/>
        <FormInput
          name='login'
          value={login}
          type='text'
          underlineShow={false}
        ></FormInput>
        <Divider/>
        <FormInput
          name='email'
          value={email}
          type='email'
          underlineShow={false}
        ></FormInput>
        <Divider/>
      </form>
    );
  }
}

class MyProfile extends Component {

  constructor() {
    super();
    this.state = {
      profile: null,
      file: null,
      loading: false,
    }
    this.mounted = true;
    this.handlePhotoAdd = this.handlePhotoAdd.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    auth.secureRequest('get', '/api/myprofile', null, (err, { data }) => {
      if (err) this.props.history.push('/signin');
      setTimeout(() => {
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

  handlePhotoAdd({ target }) {
    const file = target.files[0];
    this.setState({file});
  }

  handleUpload() {
    console.log(this.state.file);
  }

  render() {
    const style = {
      cursor: 'pointer',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100%',
      opacity: 0,
    };
    console.log(this.state);
    const { profile, file } = this.state;
    if (profile) {
      return (
        <Card>
          <CardHeader
            title="My profile"
            subtitle="Complete or update your profile"
            //avatar="images/jsa-128.jpg"
          />
          <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <FlatButton
            label='Add a photo'
            containerElement='label'
            icon={<FontIcon className="material-icons" style={{fontSize: '36px'}}>add_a_photo</FontIcon>}
          >
            <input type="file" style={style} onChange={this.handlePhotoAdd}/>
          </FlatButton>
          <FlatButton label='ok' primary={true} disabled={!file} onTouchTap={this.handleUpload}/>
          </div>
          <CardText children={<ProfileForm profile={profile}/>}/>
        </Card>
      )
    } else return <CircularProgress/>;
  }
}

export default () => (
  <div className='container'>
    <MyProfile/>
  </div>
);

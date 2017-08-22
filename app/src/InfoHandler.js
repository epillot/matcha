import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import secureRequest from './secureRequest';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import GeneralInfoForm from './GeneralInfoForm';
import EditPassword from './EditPassword';
import OtherInfoForm from './OtherInfoForm';
import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0 20px 20px 20px',
  },
  tabs: {
    backgroundColor: '#FAFAFA',
  },
};

export default class extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     profile: props.profile,
  //   }
  // }

  handleSubmit() {
  }



  render() {
    const { profile, open, location, onAuthFailed } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.onClose}
        disabled={false}
      />
    ];
    return (
      <Dialog
        title='Edit your Information'
        open={open}
        actions={actions}
        modal={true}
      >
        <Tabs style={styles.tabs}>
          <Tab label='General'>
            <div style={styles.container}>
              <GeneralInfoForm
                firstname={profile.firstname}
                lastname={profile.lastname}
                login={profile.login}
                email={profile.email}
                location={location}
                onAuthFailed={onAuthFailed}
                onEdit={data => this.props.onEdit(data)}
              />
            </div>
          </Tab>
          <Tab label='Other'>
            <div style={styles.container}>
              <OtherInfoForm
                sex={profile.sex}
                birthday={profile.birthday}
                lookingFor={profile.lookingFor}
                location={location}
                onAuthFailed={onAuthFailed}
              />
            </div>
          </Tab>
          <Tab label='Password'>
            <div style={styles.container}>
              <EditPassword
                location={location}
                onAuthFailed={onAuthFailed}
              />
            </div>
          </Tab>
        </Tabs>
      </Dialog>
    );
  }
}

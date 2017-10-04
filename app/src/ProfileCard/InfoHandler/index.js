import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import GeneralInfoForm from './GeneralInfoForm/';
import EditPassword from './EditPassword/';
import OtherInfoForm from './OtherInfoForm/';
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
        autoScrollBodyContent={true}
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
                sexValue={profile.sexValue}
                birthday={profile.birthday}
                lookingFor={profile.lookingFor}
                loc={profile.loc}
                adress={profile.adress}
                onAuthFailed={onAuthFailed}
                onEdit={data => this.props.onEdit(data)}
                location={location}
              />
            </div>
          </Tab>
          <Tab label='Password'>
            <div style={styles.container}>
              <EditPassword
                location={location}
                onAuthFailed={onAuthFailed}
                onEdit={data => this.props.onEdit(data)}
              />
            </div>
          </Tab>
        </Tabs>
      </Dialog>
    );
  }
}

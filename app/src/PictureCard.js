import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import secureRequest from './secureRequest';
import LinearProgress from 'material-ui/LinearProgress';

export default class extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.setProfilePic = this.setProfilePic.bind(this);
  }

  handleDelete() {
    if (this.state.loading) return;
    this.setState({loading: true});
    const { pic, onDelete, onAuthFailed } = this.props;
    const config = {
      method: 'delete',
      url: `/api/pictures/${pic}`,
    };
    secureRequest(config, err => {
      setTimeout(() => {
        if (err) return onAuthFailed();
        onDelete(pic);
      }, 1000);
    });
  }

  setProfilePic() {
    if (this.state.loading) return;
    this.setState({loading: true});
    const { pic, setProfilePic, onAuthFailed } = this.props;
    const config = {
      method: 'put',
      url: `/api/pictures/${pic}`,
    };
    secureRequest(config, err => {
      setTimeout(() => {
        if (err) return onAuthFailed();
        setProfilePic(pic);
      }, 1000);
    });
  }

  render() {
    const { pic, profilePic, user: { firstname, lastname, login } } = this.props;
    const { loading } = this.state;
    return (
      <Card>
        <CardHeader
          title={`${firstname} ${lastname}`}
          subtitle={`alias ${login}`}
          avatar={`static/${profilePic}`}
        />
        <CardMedia>
          <img src={`static/${pic}`} alt="" />
        </CardMedia>
        <CardActions>
          <FlatButton label="delete" onTouchTap={this.handleDelete} disabled={loading}/>
          <FlatButton label="set as profile picture" onTouchTap={this.setProfilePic} disabled={loading || pic === profilePic}/>
        </CardActions>
        {loading ? <LinearProgress/> : ''}
      </Card>
    );
  }
}

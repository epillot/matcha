import React, { Component } from 'react';
import {Card, CardActions, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import secureRequest from '../../../../secureRequest';
import LinearProgress from 'material-ui/LinearProgress';

export default class extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.updateProfilePic = this.updateProfilePic.bind(this);
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

  updateProfilePic() {
    if (this.state.loading) return;
    this.setState({loading: true});
    const { pic } = this.props;
    const config = {
      method: 'patch',
      url: '/api' + this.props.location.pathname,
      data: {
        action: 'setProfilePic',
        data: pic,
      },
    };
    secureRequest(config, err => {
      setTimeout(() => {
        if (err) return this.props.onAuthFailed();
        this.props.updateProfilePic(pic);
      }, 500);
    });
  }

  render() {
    const { editable, pic, profilePic } = this.props;
    const { loading } = this.state;
    return (
      <Card>
        <CardMedia>
          <img src={`/static/${pic}`} alt="" />
        </CardMedia>
        <CardActions>
          {editable ?
            <div>
              <FlatButton
                label="delete"
                onTouchTap={this.handleDelete}
                disabled={loading}
              />
              <FlatButton
                label="set as profile picture"
                onTouchTap={this.updateProfilePic}
                disabled={loading || pic === profilePic}
              />
            </div> : ''}
        </CardActions>
        {loading ? <LinearProgress/> : ''}
      </Card>
    );
  }
}
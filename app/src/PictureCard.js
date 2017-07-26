import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import secureRequest from './secureRequest';

export default class extends Component {

  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    const { pic } = this.state;
    const config = {
      method: 'delete',
      url: `/api/pictures/delete/${pic}`,
    };
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err === 'Unauthorized') return this.props.onAuthFailed();
      }, 1000);
    });
  }

  render() {
    console.log(this.props);
    const { pic, user: { firstname, lastname, login } } = this.props;
    return (
      <Card>
        <CardHeader
          title={`${firstname} ${lastname}`}
          subtitle={`alias ${login}`}
          avatar="static/default.jpg"
        />
        <CardMedia>
          <img src={`static/${pic}`} alt="" />
        </CardMedia>
        <CardActions>
          <FlatButton label="delete" onTouchTap={this.handleDelete}/>
          <FlatButton label="set as profile picture"/>
        </CardActions>
      </Card>
    );
  }
}

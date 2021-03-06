import React, { Component } from 'react';
import { GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PictureCard from './PictureCard/';


const style = {
  gridTile: {
    cursor: 'pointer',
  },
  imgGrid: {
    width: '266px',
    height: '200px',
  },
}

export default class extends Component {

  constructor() {
    super();
    this.state = {
      open: false,
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.updateProfilePic = this.updateProfilePic.bind(this);
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  onDelete(pic) {
    this.handleClose();
    this.props.onDelete(pic);
  }

  updateProfilePic(pic) {
    this.handleClose();
    this.props.updateProfilePic(pic)
  }

  render() {
    const { pic, profilePic, onAuthFailed, location, editable } = this.props;
    const { open } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <GridTile style={style.gridTile} onClick={this.handleOpen}>
        <img style={style.imgGrid} src={`/static/${pic}`} alt=""/>
        <Dialog
          autoScrollBodyContent={true}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={this.handleClose}
        >
          <PictureCard
            location={location}
            pic={pic}
            profilePic={profilePic}
            updateProfilePic={this.updateProfilePic}
            onDelete={this.onDelete}
            onAuthFailed={onAuthFailed}
            editable={editable}
          />
        </Dialog>
      </GridTile>
    );
  }
}

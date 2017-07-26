import React, { Component } from 'react';
import { GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PictureCard from './PictureCard';


const style = {
  gridTile: {
    cursor: 'pointer',
  },
  imgGrid: {
    width: '200px',
    height: '150px',
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
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  render() {
    const { pic, user, onAuthFailed } = this.props;
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
        <img style={style.imgGrid} src={`static/${pic}`} alt=""/>
        <Dialog
          autoScrollBodyContent={true}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={this.handleClose}
        >
          <PictureCard pic={pic} user={user} onAuthFailed={onAuthFailed}/>
        </Dialog>
      </GridTile>
    );
  }
}

import React, { Component } from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {GridList, GridTile} from 'material-ui/GridList';
import UploadHandler from './UploadHandler';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
};

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pictures: props.pictures || [],
      profilePic: 'default.jpg',
      openUpload: false,
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onUpload = this.onUpload.bind(this);
  }

  handleOpen() {
    this.setState({openUpload: true});
  }

  onClose() {
    this.setState({openUpload: false});
  }

  onUpload(pic) {
    const { pictures } = this.state;
    pictures.push(pic);
    this.setState({pictures});
  }

  render() {
    const { pictures, profilePic, openUpload } = this.state;
    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="Pictures" />
          </ToolbarGroup>
          <ToolbarGroup>
            <IconButton tooltip="Add a picture" onTouchTap={this.handleOpen}>
              <FontIcon className="material-icons" style={{fontSize: '36px'}}>add_a_photo</FontIcon>
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <UploadHandler open={openUpload} onClose={this.onClose} onUpload={this.onUpload}/>
        <div style={styles.root}>
          <GridList style={styles.gridList} cols={1}>
            {pictures.map(pic => (
              <GridTile key={pic}>
                <img src={`static/${pic}`} alt=""/>
              </GridTile>
            ))}
          </GridList>
        </div>
      </div>

    );
  }
}

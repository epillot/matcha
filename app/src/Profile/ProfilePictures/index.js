import React, { Component } from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { GridList } from 'material-ui/GridList';
import UploadHandler from './UploadHandler/';
import PictureTile from './PictureTile/';
import Paper from 'material-ui/Paper';

const styles = {
  root: {
    margin: '30px',
    maxWidth: '1500px',
  },
  gridRoot: {
    display: 'flex',
    flexWrap: 'wrap',
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
      pictures: props.pictures,
      openUpload: false,
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onDelete = this.onDelete.bind(this);
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

  onDelete(pic) {
    const { pictures } = this.state;
    const { profilePic } = this.props;
    pictures.splice(pictures.indexOf(pic), 1);
    this.setState({pictures});
    if (pic === profilePic) this.props.updateProfilePic(null);
  }

  render() {
    const { pictures, openUpload } = this.state;
    const { onAuthFailed, updateProfilePic, profilePic, location, editable } = this.props;
    return (
      <Paper style={styles.root} zDepth={2}>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="All pictures" />
          </ToolbarGroup>
          <ToolbarGroup>
            {editable ?
              <div>
                <IconButton tooltip='Add a picture' disabled={pictures.length >= 5} onTouchTap={this.handleOpen}>
                  <FontIcon className="material-icons">add_a_photo</FontIcon>
                </IconButton>
                <UploadHandler onAuthFailed={onAuthFailed} open={openUpload} onClose={this.onClose} onUpload={this.onUpload}/>
              </div> : ''}
          </ToolbarGroup>
        </Toolbar>
        <div style={styles.gridRoot}>
          <GridList style={styles.gridList} cellHeight='auto' padding={8} cols={1}>
            {pictures.map(pic =>
              <PictureTile
                profilePic={profilePic}
                key={pic}
                pic={pic}
                onDelete={this.onDelete}
                onAuthFailed={onAuthFailed}
                updateProfilePic={updateProfilePic}
                location={location}
                editable={editable}
              />
            )}
          </GridList>
        </div>
      </Paper>
    );
  }
}

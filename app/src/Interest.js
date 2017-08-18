import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import TagsHandler from './TagsHandler';
import secureRequest from './secureRequest';

const styles= {
  root: {
    marginTop: '8px',
    height: '220px',
    position: 'relative',
  },
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'Wrap',
  },
  edit: {
    position: 'absolute',
    top: '0',
    right: '0',
  }
}

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allTags: [],
      tags: props.tags || [],
      open: false,
      loading: false,
    }
    this.onAdd = this.onAdd.bind(this);
    this.onTagHandlerOpen = this.onTagHandlerOpen.bind(this)
  }

  onAdd(tag) {
    // const { tags } = this.state;
    // tags.push(tag);
    // this.setState({tags, open: false});
    // const config = {
    //   method: 'put',
    //   url:
    // }
  }

  onTagHandlerOpen() {
    this.setState({open: true, loading: true})
    const config = {
      method: 'get',
      url: '/api/alltags'
    }
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err === 'Unauthorized') return this.props.onAuthFailed();
        else if (err) return console.log(err);
        this.setState({loading: false, allTags: response.data});
      }, 1000);
    });
  }

  render() {
    const { tags, open, allTags, loading } = this.state;
    const tagsDisplay = tags.map(tag => {
      return {tag: tag, key: tag};
    });
    return (
      <Card style={styles.root}>
        <Subheader>Interest</Subheader>
        <div style={styles.edit}>
          <IconButton
            onTouchTap={this.onTagHandlerOpen}
            tooltip='Add interest (max 6)'
            disabled={tags.length > 5}
          >
            <FontIcon className="material-icons">add</FontIcon>
          </IconButton>
          <TagsHandler
            loading={loading}
            allTags={allTags}
            tags={tags}
            open={open}
            onClose={() => this.setState({open: false})}
            onAdd={this.onAdd}
          />
        </div>
        <CardText>
          <div style={styles.wrapper}>
            {tagsDisplay.map(tag =>
              <Chip
                key={tag.key}
                style={styles.chip}
                onRequestDelete={() => {}}
              >
                {'#' + tag.tag}
              </Chip>
            )}
          </div>
        </CardText>
      </Card>
    );
  }
}

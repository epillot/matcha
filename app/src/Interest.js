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
    this.onDelete = this.onDelete.bind(this);
    this.onTagHandlerOpen = this.onTagHandlerOpen.bind(this);
    this.addTagToDb = this.addTagToDb.bind(this);
  }

  onAdd(tag) {
    const { tags } = this.state;
    tags.push(tag);
    this.setState({tags, open: false});
  }

  addTagToDb(tag) {
    const config = {
      method: 'patch',
      url: '/api/alltags',
      data: {tag},
    }
    secureRequest(config, err => {
      if (err === 'Unauthorized') return this.props.onAuthFailed();
      else if (err) return console.log(err);
    })
  }

  onDelete(tag) {
    const config = {
      method: 'patch',
      url: '/api' + this.props.location.pathname,
      data: {
        action: 'delTag',
        data: tag,
      },
    };
    secureRequest(config, err => {
      if (err === 'Unauthorized') return this.props.onAuthFailed();
      else if (err) return console.log(err);
      const { tags } = this.state;
      tags.splice(tags.indexOf(tag), 1);
      this.setState({tags});
    });
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
    const { editable } = this.props;
    const tagsDisplay = tags.map(tag => {
      return {tag: tag, key: tag};
    });
    return (
      <Card style={styles.root}>
        <Subheader>Interest</Subheader>
        <div style={styles.edit}>
          {editable ?
            <div>
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
                location={this.props.location}
                addTagToDb={this.addTagToDb}
              />
            </div> : ''}
        </div>
        <CardText>
          <div style={styles.wrapper}>
            {tagsDisplay.map(tag =>
              <Chip
                key={tag.key}
                style={styles.chip}
                onRequestDelete={editable ? () => this.onDelete(tag.key) : null}
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

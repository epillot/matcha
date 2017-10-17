import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import secureRequest from '../../../secureRequest';

export default class extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      tag: '',
      error: '',
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({error: '', tag: '', loading: false});
    this.props.onClose();
  }

  handleAdd() {
    const { tag } = this.state;
    if (this.props.tags.length > 5)
      return this.setState({error: 'You can\'t have more than 6 tags on your profile'});
    if (!tag.match(/^[a-zA-Z0-9- $']{3,25}$/))
      return this.setState({error: 'Invalid tag'});
    if (this.props.tags.indexOf(tag) !== -1)
      return this.setState({error: 'This tag is already active on your profile'});
    this.setState({loading: true});
    const config = {
      method: 'patch',
      url: '/api' + this.props.location.pathname,
      data: {
        action: 'addTag',
        data: tag,
      },
    };
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err === 'Unauthorized') return this.props.onAuthFailed();
        else if (err) return console.log(err);
        const { error } = response.data;
        if (error) return this.setState({error, loading: false});
        if (this.props.allTags.indexOf(tag) === -1) this.props.addTagToDb(tag);
        this.setState({error: '', tag: '', loading: false});
        this.props.onAdd(tag);
      }, 1000);
    });
  }

  render() {
    const { tag, error, loading } = this.state;
    const actions = [
      <FlatButton
        label="Add"
        primary={true}
        disabled={!tag.match(/^[a-zA-Z0-9- $']{3,25}$/) || loading}
        onTouchTap={this.handleAdd}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
        disabled={false}
      />
    ];
    return (
      <Dialog
        title='Add interests'
        actions={actions}
        open={this.props.open}
        modal={true}
      >
        {!this.props.loading ?
          <AutoComplete
            floatingLabelText="Select or enter a tag of interest"
            hintText='3-25 characters'
            errorText={error}
            filter={AutoComplete.caseInsensitiveFilter}
            onUpdateInput={tag => this.setState({tag, error: ''})}
            dataSource={this.props.allTags.sort()}
            menuProps={{maxHeight: 250}}
          />
          : <CircularProgress/> }
        {loading ? <CircularProgress/> : ''}
      </Dialog>
    );
  }
}

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';


export default class extends Component {

  constructor(props) {
    super();
    this.state = {
      tag: '',
      error: '',
    }
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd() {
    const { tag } = this.state;
    if (!tag.match(/^[a-zA-Z0-9-$']{3,12}$/))
      return this.setState({error: 'Invalid tag'});
    if (this.props.tags.indexOf(tag) !== -1)
      return this.setState({error: 'This tag is already active on your profile'});
    this.props.onAdd(tag);
  }

  render() {
    const { tag, error } = this.state;
    const actions = [
      <FlatButton
        label="Add"
        primary={true}
        disabled={!tag.match(/^[a-zA-Z0-9-$']{3,12}$/)}
        onTouchTap={this.handleAdd}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.onClose}
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
            hintText='3-12 characters'
            errorText={error}
            filter={AutoComplete.caseInsensitiveFilter}
            onUpdateInput={tag => this.setState({tag, error: ''})}
            dataSource={this.props.allTags}
          />
          : <CircularProgress/> }
      </Dialog>
    );
  }
}

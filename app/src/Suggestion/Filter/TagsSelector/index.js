import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import DelIcon from 'material-ui/svg-icons/content/clear';
import CircularProgress from 'material-ui/CircularProgress';

export default function(props) {

  return (
    <div>
      {props.tags ?
        <AutoComplete
        textFieldStyle={{width: '180px'}}
        hintText='Select tags (max 3)'
        filter={AutoComplete.caseInsensitiveFilter}
        dataSource={props.tags.sort()}
        menuProps={{maxHeight: 250}}
        openOnFocus={true}
        onNewRequest={props.onSelect}
      /> : <CircularProgress/>}
      <List style={{width: '180px'}}>
        {props.selected.map(tag => {
          return (
            <ListItem
              key={tag}
              disabled={true}
              primaryText={tag}
              rightIconButton={
                <IconButton
                  onTouchTap={() => props.onDel(tag)}
                >
                  <DelIcon/>
                </IconButton>}
            />
          )
        })}
      </List>
    </div>
  )
}

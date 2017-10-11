import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import TagsSelector from '../TagsSelector/';

const styles = {
  root: {
    display: 'flex',
    padding: '10px',
    flexWrap: 'wrap',
  },
  range: {
    width: '180px',
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  label: {
    fontSize: '15px',
  }
}

export default function(props) {

  const { ageFilter, locFilter, popFilter, tagsFilter, sort, onCheck, open, onClose, tags, selected } = props;
  const actions = [
    <FlatButton
      label='Cancel'
      primary={true}
      onClick={onClose}
    />,
  ];
  return (
    <Dialog
      title='Options and Search'
      actions={actions}
      open={open}
      onRequestClose={onClose}
      modal={true}
      autoScrollBodyContent={true}
    >
      <div style={styles.root}>
        <div style={styles.range}>
          <Subheader>Age</Subheader>
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('ageFilter', 1)}
            checked={ageFilter === 1}
            label="18 - 25"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('ageFilter', 2)}
            checked={ageFilter === 2}
            label="26-35"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('ageFilter', 3)}
            checked={ageFilter === 3}
            label="36-50"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('ageFilter', 4)}
            checked={ageFilter === 4}
            label="51-70"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('ageFilter', 5)}
            checked={ageFilter === 5}
            label="70 or more"
          />
        </div>
        <div style={styles.range}>
          <Subheader>Distance</Subheader>
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('locFilter', 1)}
            checked={locFilter === 1}
            label="20km or less"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('locFilter', 2)}
            checked={locFilter === 2}
            label="50km or less"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('locFilter', 3)}
            checked={locFilter === 3}
            label="200km or less"
          />
        </div>
        <div style={styles.range}>
          <Subheader>Popularity</Subheader>
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('popFilter', 1)}
            checked={popFilter === 1}
            label="1 or more"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('popFilter', 2)}
            checked={popFilter === 2}
            label="10 or more"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('popFilter', 3)}
            checked={popFilter === 3}
            label="100 or more"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('popFilter', 4)}
            checked={popFilter === 4}
            label="500 or more"
          />
        </div>
        <div style={styles.range}>
          <Subheader>Commun tags</Subheader>
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('tagsFilter', 1)}
            checked={tagsFilter === 1}
            label="1 or more"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('tagsFilter', 2)}
            checked={tagsFilter === 2}
            label="2 or more"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('tagsFilter', 3)}
            checked={tagsFilter === 3}
            label="3 or more"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('tagsFilter', 4)}
            checked={tagsFilter === 4}
            label="4 or more"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('tagsFilter', 5)}
            checked={tagsFilter === 5}
            label="5 or more"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('tagsFilter', 6)}
            checked={tagsFilter === 6}
            label="6"
          />
        </div>
        <div style={styles.range}>
          <Subheader>Sort by</Subheader>
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('sort', 1)}
            checked={sort === 1}
            label="Localisation"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('sort', 2)}
            checked={sort === 2}
            label="Age"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('sort', 3)}
            checked={sort === 3}
            label="Popularity"
          />
          <Checkbox
            iconStyle={styles.icon}
            labelStyle={styles.label}
            onCheck={() => onCheck('sort', 4)}
            checked={sort === 4}
            label="Commun tags"
          />
        </div>
        <div>
          <Subheader>Tags</Subheader>
          <TagsSelector
            tags={tags}
            selected={selected}
            onSelect={props.onSelect}
            onDel={props.onDel}
          />
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <RaisedButton
          style={{marginRight: '20px'}}
          label='Get suggestions'
          secondary={true}
          onTouchTap={() => props.startSuggestions(1)}
        />
        <RaisedButton
          label='Search from all'
          secondary={true}
          onTouchTap={() => props.startSuggestions(2)}
          disabled={
            ageFilter === 0 &&
            locFilter === 0 &&
            popFilter === 0 &&
            tagsFilter === 0 &&
            selected.length === 0
          }
        />
      </div>
    </Dialog>
  );
}

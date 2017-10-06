import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';

const styles = {
  root: {
    display: 'flex',
  },
  ageRange: {
    width: '180px',
  },
}

export default class extends Component {

  constructor() {
    super();
    this.state = {
      ageRange: 0,
      locRange: 0,
      popRange: 0,
    }
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck(type, range) {
    this.setState(state => {
      if (range === state[type]) range = 0;
      return {[type]: range};
    });
  }

  render() {
    const { open, onClose } = this.props;
    const { ageRange, locRange, popRange } = this.state;
    const actions = [
      <FlatButton
        label='Cancel'
        primary={true}
        onClick={onClose}
      />,
      <FlatButton
        label='Search'
        primary={true}
        onClick={() => {}}
      />,
    ];
    return (
      <Dialog
        title='Advanced search'
        actions={actions}
        open={open}
        onRequestClose={onClose}
        modal={true}
      >
        <div style={styles.root}>
          <div style={styles.ageRange}>
            <Subheader>Age</Subheader>
            <Checkbox
              onCheck={() => this.handleCheck('ageRange', 1)}
              checked={ageRange === 1}
              label="18 - 25"
            />
            <Checkbox
              onCheck={() => this.handleCheck('ageRange', 2)}
              checked={ageRange === 2}
              label="26-35"
            />
            <Checkbox
              onCheck={() => this.handleCheck('ageRange', 3)}
              checked={ageRange === 3}
              label="36-50"
            />
            <Checkbox
              onCheck={() => this.handleCheck('ageRange', 4)}
              checked={ageRange === 4}
              label="51-70"
            />
            <Checkbox
              onCheck={() => this.handleCheck('ageRange', 5)}
              checked={ageRange === 5}
              label="70 or more"
            />
          </div>
          <div style={styles.ageRange}>
            <Subheader>Distance</Subheader>
            <Checkbox
              onCheck={() => this.handleCheck('locRange', 1)}
              checked={locRange === 1}
              label="20km or less"
            />
            <Checkbox
              onCheck={() => this.handleCheck('locRange', 2)}
              checked={locRange === 2}
              label="50km or less"
            />
            <Checkbox
              onCheck={() => this.handleCheck('locRange', 3)}
              checked={locRange === 3}
              label="200km or less"
            />
          </div>
          <div style={styles.ageRange}>
            <Subheader>Popularity</Subheader>
            <Checkbox
              onCheck={() => this.handleCheck('popRange', 1)}
              checked={popRange === 1}
              label="1 or more"
            />
            <Checkbox
              onCheck={() => this.handleCheck('popRange', 2)}
              checked={popRange === 2}
              label="10 or more"
            />
            <Checkbox
              onCheck={() => this.handleCheck('popRange', 3)}
              checked={popRange === 3}
              label="100 or more"
            />
            <Checkbox
              onCheck={() => this.handleCheck('popRange', 4)}
              checked={popRange === 4}
              label="500 or more"
            />
          </div>
          <div style={styles.ageRange}>
            <Subheader>Popularity</Subheader>
            <Checkbox
              onCheck={() => this.handleCheck('popRange', 1)}
              checked={popRange === 1}
              label="1 or more"
            />
            <Checkbox
              onCheck={() => this.handleCheck('popRange', 2)}
              checked={popRange === 2}
              label="10 or more"
            />
            <Checkbox
              onCheck={() => this.handleCheck('popRange', 3)}
              checked={popRange === 3}
              label="100 or more"
            />
            <Checkbox
              onCheck={() => this.handleCheck('popRange', 4)}
              checked={popRange === 4}
              label="500 or more"
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

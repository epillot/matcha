import React, { Component } from 'react';
import secureRequest from '../secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import ProfilePreview from './ProfilePreview/';
import { Toolbar } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    overflowY: 'auto',
    maxHeight: '80vh',
  },
  container: {
    padding: '10px',
  }
};

export default class extends Component {

  constructor() {
    super();
    this.state = {
      matchs: null,
    };
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    const config = {
      method: 'get',
      url: '/api/suggestion',
    }
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err) return this.props.onLogout();
        const { matchs } = response.data;
        console.log(matchs);
        if (this.mounted) {
          this.setState({matchs, toDisplay: 8});
        }
      }, 500);
    });
  }

  render() {
    const { matchs } = this.state;
    if (matchs === null) return <CircularProgress/>
    else if (matchs.length === 0) return <p>No suggestion found, sorry</p>
    else return (
      <Paper style={{width: '90%', margin: '30px auto'}}>
        <Toolbar/>
        <div style={styles.root}>
          {matchs.map(match =>
            <div style={styles.container} key={match._id}>
              <ProfilePreview
                onClick={() => this.props.history.push('/profile/' + match._id)}
                profile={match}
              />
            </div>
          )}
        </div>
      </Paper>
    );
  }

}

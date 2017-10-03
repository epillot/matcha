import React, { Component } from 'react';
import secureRequest from '../secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import ProfileCard from '../ProfileCard/';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
        if (this.mounted) {
          this.setState({matchs: response.data, toDisplay: 8});
        }
      }, 500);
    });
  }

  render() {
    const { matchs, toDisplay } = this.state;
    if (matchs === null) return <CircularProgress/>
    else if (matchs.length === 0) return <p>No suggestion found, sorry</p>
    else return (
      <div style={styles.root}>
        {matchs.slice(0, toDisplay).map(match =>
          <div style={styles.container} key={match._id}>
          <ProfileCard
            onClick={() => this.props.history.push('/profile/' + match._id)}
            profile={match}
            editable={false}
            clickable={true}
          />
          </div>
        )}
      </div>
    );
  }

}

import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './auth';

class PrivateRoute extends Component {

  state = {
    loggued: null
  }

  componentDidMount() {
    auth.authenticate(loggued => {
      console.log(loggued);
      this.setState({
        loggued: loggued
      })
    })
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route {...rest} render={props => {
        if (this.state.loggued === true) {
          return <Component {...props}/>;
        } else if (this.state.loggued === false) {
          return (
            <Redirect to={{
              pathname: '/signin',
              state: { from: props.location }
            }}/>
          );
        } else {return <div>Loading...</div>}
      }}/>
    )
  }
}

export default PrivateRoute;

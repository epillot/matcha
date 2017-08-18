import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
//import auth from './auth';

class PrivateRoute extends Component {

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route {...rest} render={props => {
        if (this.props.loggued !== false) {
          return <Component {...props} {...this.props}/>;
        } else {
          return (
            <Redirect to={{
              pathname: '/home',
              state: { from: props.location }
            }}/>
          );
        }
      }}/>
    )
  }
}

export default PrivateRoute;

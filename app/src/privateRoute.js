import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
//import auth from './auth';

class PrivateRoute extends Component {

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route {...rest} render={props => {
        if (this.props.loggued) {
          return <Component {...props} {...this.props}/>;
        } else if (this.props.loggued === false) {
          return (
            <Redirect to={{
              pathname: '/home',
              state: { from: props.location }
            }}/>
          );
        } else return <CircularProgress/>
      }}/>
    )
  }
}

export default PrivateRoute;

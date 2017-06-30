import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
//import auth from './auth';

class PrivateRoute extends Component {

  // state = {
  //   loggued: null
  // }
  //
  // componentDidMount() {
  //   console.log('componentDidMount ' + this.props.component.name);
  //   auth.secureRequest('get', '/api/auth', null, err => {
  //     this.setState({
  //       loggued: err ? false : true
  //     })
  //   });
  // }

  render() {
    const { component: Component, ...rest } = this.props;
    //console.log(Component.name + ' is rendering...');
    return (
      <Route {...rest} render={props => {
        if (this.props.loggued === true) {
          return <Component {...props}/>;
        } else if (this.props.loggued === false) {
          return (
            <Redirect to={{
              pathname: '/signin',
              state: { from: props.location }
            }}/>
          );
        } else return <div>Loading...</div>;
      }}/>
    )
  }
}

export default PrivateRoute;

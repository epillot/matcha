import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <BrowserRouter>
      <Route path='/' component={App}/>
    </BrowserRouter>
  </MuiThemeProvider>, document.getElementById('root')
);

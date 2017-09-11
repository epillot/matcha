import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import io from 'socket.io-client';

global.socket = io('http://localhost:8000');

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </MuiThemeProvider>, document.getElementById('root')
);

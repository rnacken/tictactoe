import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import './index.css';
import Consumer, { AppProvider } from "./context/appContext";
import App from './App';

import history from './history';

ReactDOM.render((
  <Router history={history}>
    <AppProvider>
      <Consumer>
        {ctx => <App ctx={ctx} /> }
      </Consumer>
    </AppProvider>
  </Router>
), document.getElementById('root'));

import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'components';
require('dotenv').config()


ReactDOM.render(
  <React.StrictMode>
        <App />
      </React.StrictMode>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { store } from './store';

import './index.css';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google';
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId="837792396616-qrf1rvurfn9ad976vm36indtsdegqlsu.apps.googleusercontent.com">
    <Provider store={ store } >
      <App />
    </Provider>
  </GoogleOAuthProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
